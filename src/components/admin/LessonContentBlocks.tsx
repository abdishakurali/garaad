"use client";

import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { adminApi as api, ApiError } from '@/lib/admin-api';
import type { ContentBlock, ContentBlockData, Option, DiagramConfig, DiagramObject, ProblemData } from '@/app/admin/types/content';
import { ContentBlockModal } from './ContentBlockModal';
import { Modal } from './ui/Modal';
import { Video, Link, Trash2, Plus, Upload, Loader2, X, Sparkles, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { DEFAULT_CONTENT, DIAGRAM_EXAMPLE, MULTIPLE_CHOICE_EXAMPLE, TABLE_EXAMPLE, DEFAULT_DIAGRAM_CONFIG, LIST_EXAMPLE } from '@/lib/admin/Block_Examples';
import { RichTextEditor } from './ui/RichTextEditor';

interface LessonContentBlocksProps {
    lessonId: number;
    onUpdate?: () => void;
}

const ProblemContent = ({
    problemId,
    fetchProblemDetails
}: {
    problemId: number;
    fetchProblemDetails: (problemId: number) => Promise<ProblemData>;
}) => {
    const [problemContent, setProblemContent] = useState<ProblemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProblemContent = async () => {
            try {
                setLoading(true);
                const data = await fetchProblemDetails(problemId);
                setProblemContent(data);
            } catch (err) {
                console.error('Error loading problem content:', err);
                const error = err as Error;
                setError(error.message || 'Could not load problem content');
            } finally {
                setLoading(false);
            }
        };

        loadProblemContent();
    }, [problemId, fetchProblemDetails]);

    if (loading) {
        return <div className="text-sm text-gray-500 text-center py-4">Loading problem content...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-500 p-2 bg-red-50 rounded">{error}</div>;
    }

    if (!problemContent) {
        return <div className="text-sm text-gray-500">No problem content available</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                    {problemContent.which && (
                        <div className="text-sm text-gray-500 mb-1 font-medium">{problemContent.which}</div>
                    )}
                    <div className="text-gray-900 font-semibold">{problemContent.question_text}</div>
                    <p className="mt-1 text-xs text-blue-600 font-bold uppercase tracking-wider">Su'aal ({problemContent.question_type})</p>
                </div>
                {problemContent.img && (
                    <div className="md:w-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                        <img
                            src={problemContent.img}
                            alt="Question illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                {problemContent.video_url && (
                    <div className="md:w-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-black shadow-sm">
                        <video
                            src={`${problemContent.video_url}#t=0.1`}
                            poster={problemContent.thumbnail_url || undefined}
                            preload="metadata"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            {problemContent.options && problemContent.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {problemContent.options.map((option: Option) => (
                        <div
                            key={option.id}
                            className={`text-sm p-3 rounded-xl transition-all ${problemContent.correct_answer?.some((ans: Option) => ans.id === option.id)
                                ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                                }`}
                        >
                            {option.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function LessonContentBlocks({ lessonId, onUpdate }: LessonContentBlocksProps) {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingContent, setEditingContent] = useState<ContentBlockData>(DEFAULT_CONTENT);
    const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [showEditBlock, setShowEditBlock] = useState(false);
    const [showDeleteBlock, setShowDeleteBlock] = useState(false);
    const [deletingBlock, setDeletingBlock] = useState<ContentBlock | null>(null);
    const [adding, setAdding] = useState(false);
    const [editError, setEditError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [videoUploading, setVideoUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [tableType, setTableType] = useState<string>('');
    const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());

    const toggleBlock = (id: number) => {
        const newExpanded = new Set(expandedBlocks);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedBlocks(newExpanded);
    };

    const fetchProblemDetails = async (problemId: number): Promise<ProblemData> => {
        const response = await api.get(`lms/problems/${problemId}/`);
        return response.data;
    };

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setLoading(true);
                const response = await api.get(`lms/lesson-content-blocks/?lesson=${lessonId}`);
                if (Array.isArray(response.data)) {
                    const sortedBlocks = response.data.sort((a: ContentBlock, b: ContentBlock) => a.order - b.order);
                    setBlocks(sortedBlocks);
                }
            } catch (err) {
                console.error('Error fetching blocks:', err);
                const apiError = err as ApiError;
                setError(apiError.message || 'Qeybaha casharkan lama soo saari karin');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchBlocks();
        }
    }, [lessonId]);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, setContent: (content: ContentBlockData) => void, content: ContentBlockData) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setVideoUploading(true);
            setUploadProgress(0);
            setError('');

            const formData = new FormData();
            formData.append('video', file);
            formData.append('title', content.title || file.name);

            const response = await api.post('lms/videos/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress);
                },
            });

            setContent({
                ...content,
                url: response.data.url,
                source: response.data.url,
                video_url: response.data.url,
                thumbnail_url: response.data.thumbnail_url,
                uploaded_video_id: response.data.id,
                video_source_type: 'upload'
            });
        } catch (err) {
            console.error('Video upload error:', err);
            const apiError = err as ApiError;
            setError(apiError.response?.data?.detail || 'Muuqaalka lama soo galin karin');
        } finally {
            setVideoUploading(false);
        }
    };

    const handleAddBlock = async (e?: React.FormEvent, closeOnSuccess: boolean = true) => {
        if (e) e.preventDefault();
        setAdding(true);
        setError('');

        try {
            const specifiedOrder = blocks.length;
            let blockData: any;

            if (editingContent.type === 'problem') {
                const problemRes = await api.post('lms/problems/', {
                    ...editingContent,
                    lesson: lessonId,
                    order: specifiedOrder
                });
                blockData = {
                    block_type: 'problem',
                    content: {},
                    order: specifiedOrder,
                    lesson: lessonId,
                    problem: problemRes.data.id
                };
            } else if (editingContent.type === 'video') {
                let videoUrl = editingContent.url || '';
                let videoTitle = editingContent.title || '';

                if (editingContent.isDirectUpload && editingContent.directFile) {
                    setVideoUploading(true);
                    setUploadProgress(0);
                    // Upload logic is already available in handleVideoUpload but that was for inline upload.
                    // We can reuse the API call logic here or extract it.
                    // Given the previous handleVideoUpload was attached to a specific file input change event,
                    // we'll implement the upload here for the "Add Block" submission flow if it wasn't already uploaded.

                    try {
                        const formData = new FormData();
                        formData.append('video', editingContent.directFile);
                        formData.append('title', videoTitle || editingContent.directFile.name);

                        const uploadRes = await api.post('lms/videos/', formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                                }
                            },
                        });
                        videoUrl = uploadRes.data.url;
                        videoTitle = uploadRes.data.title;
                    } catch (uploadErr) {
                        console.error("Direct upload failed", uploadErr);
                        setError("Waa la waayay soo gelinta muuqaalka.");
                        setVideoUploading(false);
                        setAdding(false);
                        return;
                    }
                    setVideoUploading(false);
                }

                blockData = {
                    block_type: 'video',
                    content: {
                        source: videoUrl,
                        url: videoUrl,
                        title: videoTitle,
                        video_source_type: editingContent.video_source_type || 'upload'
                    },
                    order: specifiedOrder,
                    lesson: lessonId
                };
            } else {
                blockData = {
                    block_type: 'text',
                    content: editingContent,
                    order: specifiedOrder,
                    lesson: lessonId
                };
            }

            const res = await api.post('lms/lesson-content-blocks/', blockData);
            setBlocks([...blocks, res.data]);
            if (closeOnSuccess) {
                setShowAddBlock(false);
                setEditingContent(DEFAULT_CONTENT);
            }
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Add block error:', err);
            setError('Lama dari karin qeyb cusub.');
        } finally {
            setAdding(false);
        }
    };

    const handleEditBlock = (block: ContentBlock) => {
        setEditingBlock(block);
        setEditingContent({
            ...DEFAULT_CONTENT,
            type: block.block_type as any,
            ...(block.content as any),
            id: block.id
        });
        setShowEditBlock(true);
    };

    const handleUpdateBlock = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editingBlock) return;
        setAdding(true);
        setError('');

        try {
            let blockData: any;
            if (editingContent.type === 'problem' && editingBlock.problem) {
                // For problems, we update the problem itself
                await api.patch(`lms/problems/${editingBlock.problem}/`, {
                    ...editingContent,
                    lesson: lessonId,
                });
                blockData = {
                    block_type: 'problem',
                    content: {},
                };
            } else if (editingContent.type === 'video') {
                blockData = {
                    block_type: 'video',
                    content: {
                        source: editingContent.url || '',
                        url: editingContent.url || '',
                        title: editingContent.title || '',
                        video_source_type: editingContent.video_source_type || 'upload'
                    },
                };
            } else {
                blockData = {
                    block_type: 'text',
                    content: editingContent,
                };
            }

            const res = await api.patch(`lms/lesson-content-blocks/${editingBlock.id}/`, blockData);
            setBlocks(blocks.map(b => b.id === editingBlock.id ? res.data : b));
            setShowEditBlock(false);
            setEditingBlock(null);
            setEditingContent(DEFAULT_CONTENT);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Update block error:', err);
            setError('Lama cusboonaysiin karin qeybta.');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteBlock = async () => {
        if (!deletingBlock) return;
        try {
            await api.delete(`lms/lesson-content-blocks/${deletingBlock.id}/`);
            setBlocks(blocks.filter(b => b.id !== deletingBlock.id));
            setShowDeleteBlock(false);
            setDeletingBlock(null);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError('Lama tiri karin qeybta.');
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return;

        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(index, 1);
        newBlocks.splice(newIndex, 0, moved);

        // Optimistic UI update
        setBlocks(newBlocks);

        try {
            await api.post('lms/lesson-content-blocks/reorder/', {
                lesson_id: lessonId,
                block_order: newBlocks.map(b => b.id)
            });
            if (onUpdate) onUpdate();
        } catch (err) {
            setError('Dib u habeynta ma suuragalin.');
        }
    };

    const renderBlockIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="w-3.5 h-3.5 text-rose-500" />;
            case 'problem': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
            default: return <Link className="w-3.5 h-3.5 text-blue-500" />;
        }
    };

    const filteredBlocks = blocks;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-3xl">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Soo loading qeybaha...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm flex items-center gap-3">
                    <X className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-100">
                <div className="flex flex-col">
                    <h3 className="text-base font-black text-gray-900 tracking-tight">Qeybaha casharka ({blocks.length})</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Maamul casharkaaga</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setEditingContent(DEFAULT_CONTENT);
                            setShowAddBlock(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-xs"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ku dar Qeyb</span>
                    </button>
                </div>
            </div>

            <div className="px-4 space-y-3">
                {filteredBlocks.map((block, index) => {
                    const isExpanded = expandedBlocks.has(block.id);
                    return (
                        <div
                            key={block.id}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden"
                        >
                            <div className="flex items-center p-3 gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <button
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-30 text-gray-400"
                                    >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === blocks.length - 1}
                                        className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-30 text-gray-400"
                                    >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    {renderBlockIcon(block.block_type)}
                                </div>

                                <div className="flex-1 min-w-0 flex items-center gap-3 cursor-pointer" onClick={() => toggleBlock(block.id)}>
                                    <div className="flex flex-col">
                                        <div className="font-black text-gray-900 text-xs truncate flex items-center gap-2">
                                            {block.block_type === 'problem' ? 'Su\'aal' :
                                                block.block_type === 'video' ? 'Muuqaal' :
                                                    'Qoraal'}
                                            <span className="text-[8px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md font-bold uppercase">Order: {block.order}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 truncate font-medium">
                                            {isExpanded ? 'Guji si aad u xirto' : 'Guji si aad u aragto xogta'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditBlock(block)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                        title="Wax ka badal"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeletingBlock(block);
                                            setShowDeleteBlock(true);
                                        }}
                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                        title="Tirtir"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-12 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-xs">
                                        {block.block_type === 'problem' && block.problem ? (
                                            <ProblemContent problemId={block.problem} fetchProblemDetails={fetchProblemDetails} />
                                        ) : (
                                            <div className="text-gray-600 leading-relaxed">
                                                {(block.content as any).title && <div className="font-black text-gray-900 mb-2 border-b border-gray-200 pb-1">{(block.content as any).title}</div>}
                                                <div dangerouslySetInnerHTML={{ __html: (block.content as any).text || (block.content as any).question_text || 'No text content' }} className="prose prose-sm max-w-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredBlocks.length === 0 && (
                    <div className="text-center py-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <Plus className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-gray-900 font-black text-sm">Lama helin waxyaabo</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Guji badhanka kore si aad ugu darto</p>
                    </div>
                )}
            </div>

            {/* Modals for Add/Delete */}
            {/* Implementation simplified for brevity in this migration step */}
            <ContentBlockModal
                isOpen={showAddBlock || showEditBlock}
                onClose={() => {
                    setShowAddBlock(false);
                    setShowEditBlock(false);
                    setEditingBlock(null);
                    setEditingContent(DEFAULT_CONTENT);
                }}
                onSubmit={showEditBlock ? handleUpdateBlock : handleAddBlock}
                title={showEditBlock ? "Wax ka badal Qeybta" : "Ku dar Qeyb Cusub"}
                content={editingContent}
                setContent={setEditingContent}
                isAdding={adding}
                renderContentForm={(content, setContent) => (
                    <div className="space-y-4">
                        {!showEditBlock && (
                            <select
                                value={content.type}
                                onChange={e => setContent({ ...content, type: e.target.value as any })}
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold"
                            >
                                <option value="qoraal">Qoraal</option>
                                <option value="video">Muuqaal</option>
                                <option value="problem">Su'aal</option>
                            </select>
                        )}

                        {content.type === 'video' ? (
                            <div className="space-y-4">
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setContent({ ...content, isDirectUpload: false })}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!content.isDirectUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Dooro Muuqaal (URL)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContent({ ...content, isDirectUpload: true })}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${content.isDirectUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Soo Geli Cusub
                                    </button>
                                </div>

                                {content.isDirectUpload ? (
                                    <div className="space-y-3 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center relative">
                                        {!content.directFile && (
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setContent({ ...content, directFile: file, title: content.title || file.name.replace(/\.[^/.]+$/, "") });
                                                }}
                                            />
                                        )}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${content.directFile ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {content.directFile ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            {content.directFile ? (
                                                <div className="relative z-10">
                                                    <p className="font-bold text-sm text-gray-900">{content.directFile.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setContent({ ...content, directFile: null });
                                                        }}
                                                        className="text-xs text-red-500 hover:underline mt-1 font-bold"
                                                    >
                                                        Ka saar
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="font-bold text-sm text-gray-700">Guji si aad u soo geliso</p>
                                            )}
                                            {!content.directFile && <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">MP4, WebM (Max 2GB)</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Xiriirka Muuqaalka (URL) *</label>
                                        <input
                                            type="text"
                                            value={content.url || ''}
                                            onChange={e => setContent({ ...content, url: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-gray-200 font-medium"
                                            placeholder="https://..."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1.5">Geli URL-ka tooska ah ee muuqaalka</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cinwaanka Muuqaalka</label>
                                    <input
                                        type="text"
                                        value={content.title || ''}
                                        onChange={e => setContent({ ...content, title: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 font-medium"
                                        placeholder="Tusaale: Hordhac koorsada..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <RichTextEditor
                                content={content.text || ''}
                                onChange={val => setContent({ ...content, text: val })}
                            />
                        )}
                    </div>
                )}
            />

            <Modal
                isOpen={showDeleteBlock}
                onClose={() => setShowDeleteBlock(false)}
                title="Ma hubtaa?"
            >
                <div className="p-6 text-center">
                    <p className="text-gray-500 mb-8">Ma hubtaa inaad tirtirto qeybtan? Ficilkan lagama noqon karo.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteBlock(false)}
                            className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                        >
                            Maya
                        </button>
                        <button
                            onClick={handleDeleteBlock}
                            className="flex-1 py-3 px-6 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                        >
                            Haa, Tirtir
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
