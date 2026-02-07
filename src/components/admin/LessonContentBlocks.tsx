"use client";

import { useState, useEffect, FormEvent, MouseEvent, Fragment } from 'react';
import { adminApi as api, ApiError } from '@/lib/admin-api';
import type { ContentBlock, ContentBlockData, Option, DiagramConfig, DiagramObject, ProblemData } from '@/app/admin/types/content';
import { ContentBlockModal } from './ContentBlockModal';
import { Modal } from './ui/Modal';
import {
    Plus, Trash2, Video, Type, Image as LucideImage, HelpCircle, Save, X,
    GripVertical, Info, Layout, List as ListIcon, Table as TableIcon,
    Square, CheckSquare, AlignLeft, Hash, Link, Calculator, BarChart2,
    Upload, Loader2, Sparkles, ChevronUp, ChevronDown, CheckCircle, PlusCircle,
    ArrowUpDown
} from 'lucide-react';
import { addStyles, EditableMathField } from 'react-mathquill';

// Load MathQuill styles
if (typeof window !== 'undefined') {
    addStyles();
}
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

    const renderOptions = () => {
        if (!problemContent.options || problemContent.options.length === 0) return null;

        if (problemContent.question_type === 'matching') {
            return (
                <div className="space-y-2 mt-3">
                    {problemContent.options.map((option: Option) => {
                        const [left, right] = option.text.split('|||');
                        return (
                            <div key={option.id} className="flex items-center gap-4">
                                <div className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium">{left}</div>
                                <div className="text-gray-400">→</div>
                                <div className="flex-1 p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-700">{right}</div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
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
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                    {problemContent.which && (
                        <div className="text-sm text-gray-500 mb-1 font-medium" dangerouslySetInnerHTML={{ __html: problemContent.which }} />
                    )}
                    <div className="text-gray-900 font-semibold" dangerouslySetInnerHTML={{ __html: problemContent.question_text }} />
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

            {renderOptions()}

            {(problemContent.question_type === 'fill_blank' ||
                problemContent.question_type === 'open_ended' ||
                problemContent.question_type === 'math_expression' ||
                problemContent.question_type === 'code') && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Jawaabta Saxda ah</p>
                        <div className="text-sm font-medium text-emerald-700">
                            {problemContent.correct_answer?.[0]?.text || 'No answer provided'}
                        </div>
                    </div>
                )}

            {problemContent.explanation && (
                <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Sharaxaad</p>
                    <div className="text-xs text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: problemContent.explanation }} />
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
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadImageError, setUploadImageError] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadImageError('');

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('title', file.name);

        try {
            const res = await api.post('lms/photos/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditingContent({
                ...editingContent,
                img_url: res.data.photo_url || res.data.url
            });
        } catch (err: any) {
            console.error('Image upload failed:', err);
            setUploadImageError(err.response?.data?.detail || 'Sawirka waa la soo daji waayay');
        } finally {
            setUploadingImage(false);
        }
    };
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
                const problemData: any = {
                    ...editingContent,
                    lesson: lessonId,
                    order: specifiedOrder
                };

                // Remove fields that shouldn't be in the direct post if they are empty
                if (!problemData.img) delete problemData.img;
                if (!problemData.video_url) delete problemData.video_url;

                const problemRes = await api.post('lms/problems/', problemData);
                blockData = {
                    block_type: 'problem',
                    content: {
                        points: editingContent.xp || editingContent.points || 10
                    },
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
                // Determine if it should be an image or text block based on content
                const isImageOnly = editingContent.img_url && !editingContent.text;

                blockData = {
                    block_type: isImageOnly ? 'image' : 'text',
                    content: {
                        ...editingContent,
                        // Map frontend img_url back to backend url if it's an image block
                        url: isImageOnly ? editingContent.img_url : editingContent.url,
                        format: editingContent.format || 'markdown'
                    },
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
    const handleEditBlock = async (block: ContentBlock) => {
        setEditingBlock(block);

        // Normalize types between backend and frontend
        let normalizedType: any = block.block_type;
        if (['text', 'image', 'code', 'example', 'qoraal'].includes(block.block_type)) {
            normalizedType = 'qoraal';
        }

        const blockContent = (block.content as any) || {};
        let initialContent: any = {
            ...DEFAULT_CONTENT,
            type: normalizedType,
            ...blockContent,
            id: block.id
        };

        // Special mapping for image blocks (backend 'url' -> frontend 'img_url')
        if (block.block_type === 'image' && blockContent.url) {
            initialContent.img_url = blockContent.url;
        }

        // Special mapping for code blocks
        if ((block.block_type === 'code' || block.block_type === 'example') && blockContent.code) {
            initialContent.text = blockContent.code; // Or handle code specifically if UI supports it
        }

        // For problem blocks, we need to fetch the full problem details
        if (block.block_type === 'problem' && block.problem) {
            try {
                setAdding(true); // Show loader during fetch
                const problemData = await fetchProblemDetails(block.problem);
                initialContent = {
                    ...initialContent,
                    ...problemData,
                    type: 'problem',
                    xp: problemData.points || initialContent.xp || 10 // Sync xp/points
                };
            } catch (err) {
                console.error('Failed to fetch problem details for editing:', err);
                setError('Lama soo saari karin macluumaadka su\'aasha.');
            } finally {
                setAdding(false);
            }
        }

        setEditingContent(initialContent);
        setShowEditBlock(true);
    };

    const handleUpdateBlock = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editingBlock) return;
        setAdding(true);
        setError('');

        const isTypeChanged = editingBlock.block_type !== editingContent.type;
        let blockData: any;

        if (editingContent.type === 'problem') {
            let problemId = editingBlock.problem;

            // If we changed to problem and don't have one, create it
            // Or if we already have one, update it
            const problemData: any = {
                ...editingContent,
                lesson: lessonId,
            };
            if (!problemData.img) problemData.img = null;
            if (!problemData.video_url) problemData.video_url = null;

            if (problemId) {
                await api.put(`lms/problems/${problemId}/`, problemData);
            } else {
                const problemRes = await api.post('lms/problems/', {
                    ...problemData,
                    order: editingBlock.order
                });
                problemId = problemRes.data.id;
            }

            blockData = {
                block_type: 'problem',
                content: {
                    points: editingContent.xp || editingContent.points || 10
                },
                problem: problemId
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
                problem: null // Clear problem if changing from problem to video
            };
        } else {
            // Determine if it should be an image or text block based on content
            const isImageOnly = editingContent.img_url && !editingContent.text;
            const targetType = isImageOnly ? 'image' : 'text';

            blockData = {
                block_type: targetType,
                content: {
                    ...editingContent,
                    // Map frontend img_url back to backend url if it's an image block
                    url: isImageOnly ? editingContent.img_url : editingContent.url,
                    format: editingContent.format || 'markdown'
                },
                problem: null // Clear problem if changing from problem to text/image
            };
        }

        try {
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
                    <div className="space-y-6">
                        {/* Block Type Selection */}
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                            <span className="text-sm font-bold text-gray-700">Nooca Qeybta</span>
                            <select
                                value={content.type}
                                onChange={e => {
                                    const newType = e.target.value as any;
                                    if (newType === 'problem') {
                                        setContent({ ...MULTIPLE_CHOICE_EXAMPLE, order: content.order });
                                    } else if (newType === 'list') {
                                        setContent({ ...LIST_EXAMPLE, order: content.order });
                                    } else if (newType === 'table' || newType === 'table-grid') {
                                        setContent({ ...TABLE_EXAMPLE, type: newType, order: content.order });
                                    } else {
                                        setContent({ ...DEFAULT_CONTENT, type: newType, order: content.order });
                                    }
                                }}
                                className="p-2.5 rounded-xl border border-gray-200 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                            >
                                <option value="qoraal">Qoraal</option>
                                <option value="video">Muuqaal</option>
                                <option value="problem">Su'aal</option>
                                <option value="list">Liis (List)</option>
                                <option value="table">Jadwal (Table)</option>
                                <option value="table-grid">Jadwal Grid</option>
                            </select>
                        </div>

                        {/* Video Content Form */}
                        {content.type === 'video' && (
                            <div className="space-y-4">
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setContent({ ...content, isDirectUpload: false })}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!content.isDirectUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Dooro Muuqaal (URL)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContent({ ...content, isDirectUpload: true })}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${content.isDirectUpload ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
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
                        )}

                        {/* Problem Content Form */}
                        {content.type === 'problem' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Nooca Su'aasha</label>
                                        <select
                                            value={content.question_type || 'multiple_choice'}
                                            onChange={e => {
                                                const newType = e.target.value as any;
                                                const updatedContent = { ...content, question_type: newType };
                                                if (newType === 'true_false') {
                                                    updatedContent.options = [{ id: 'true', text: 'Sax' }, { id: 'false', text: 'Qalad' }];
                                                    updatedContent.correct_answer = [{ id: 'true', text: 'Sax' }];
                                                } else if (['fill_blank', 'open_ended', 'math_expression', 'code'].includes(newType)) {
                                                    updatedContent.options = [];
                                                    updatedContent.correct_answer = [{ id: 'answer', text: '' }];
                                                }
                                                setContent(updatedContent);
                                            }}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="multiple_choice">Doorashooyin Badan</option>
                                            <option value="single_choice">Hal Doorasho</option>
                                            <option value="true_false">Sax ama Qalad</option>
                                            <option value="fill_blank">Buuxi Meelaha Banaan</option>
                                            <option value="matching">Isku Xirka (Matching)</option>
                                            <option value="open_ended">Jawaab Furan</option>
                                            <option value="math_expression">Raasiga (Math/LaTeX)</option>
                                            <option value="code">Koodh (Code)</option>
                                            <option value="diagram">Jaantus (Diagram)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Dhibcaha XP</label>
                                        <input
                                            type="number"
                                            value={content.xp || 10}
                                            onChange={e => setContent({ ...content, xp: parseInt(e.target.value) })}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Su'aasha *</label>
                                        <RichTextEditor
                                            content={content.question_text || ''}
                                            onChange={val => setContent({ ...content, question_text: val })}
                                            placeholder="Geli su'aasha halkan..."
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    {['multiple_choice', 'single_choice', 'matching'].includes(content.question_type || '') && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between px-1">
                                                <div className="flex flex-col">
                                                    <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight">Doorashooyinka</h5>
                                                    {content.question_type === 'matching' && (
                                                        <span className="text-[9px] text-blue-500 font-bold uppercase mt-0.5 italic">Format: Left ||| Right</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setContent({ ...content, options: [...(content.options || []), { id: Math.random().toString(36).substr(2, 9), text: '' }] })}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    Mid kale
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {(content.options || []).map((option, idx) => {
                                                    const isCorrect = content.correct_answer?.some(ans => ans.id === option.id);
                                                    return (
                                                        <div key={option.id} className="flex gap-2 items-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentCorrect = content.correct_answer || [];
                                                                    if (content.question_type === 'single_choice') {
                                                                        setContent({ ...content, correct_answer: [option] });
                                                                    } else {
                                                                        const alreadyCorrect = currentCorrect.some(ans => ans.id === option.id);
                                                                        if (alreadyCorrect) {
                                                                            setContent({ ...content, correct_answer: currentCorrect.filter(ans => ans.id !== option.id) });
                                                                        } else {
                                                                            setContent({ ...content, correct_answer: [...currentCorrect, option] });
                                                                        }
                                                                    }
                                                                }}
                                                                className={`p-2 rounded-xl border transition-all ${isCorrect
                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-500'
                                                                    }`}
                                                                title={isCorrect ? "Jawaabta saxda ah" : "U calaamadee inay sax tahay"}
                                                            >
                                                                <CheckCircle className={`w-4 h-4 ${isCorrect ? 'animate-in zoom-in duration-300' : ''}`} />
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={option.text}
                                                                onChange={e => {
                                                                    const newOptions = [...(content.options || [])];
                                                                    newOptions[idx].text = e.target.value;

                                                                    // Also update correct_answer if this option was correct
                                                                    const newCorrect = (content.correct_answer || []).map(ans =>
                                                                        ans.id === option.id ? { ...ans, text: e.target.value } : ans
                                                                    );

                                                                    setContent({ ...content, options: newOptions, correct_answer: newCorrect });
                                                                }}
                                                                className={`flex-1 p-2 rounded-xl border transition-all text-xs font-medium outline-none ${isCorrect
                                                                    ? 'bg-emerald-50/30 border-emerald-100 ring-2 ring-emerald-50'
                                                                    : 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-100'}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newOptions = (content.options || []).filter(o => o.id !== option.id);
                                                                    const newCorrect = (content.correct_answer || []).filter(ans => ans.id !== option.id);
                                                                    setContent({ ...content, options: newOptions, correct_answer: newCorrect });
                                                                }}
                                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {['fill_blank', 'open_ended', 'math_expression', 'code'].includes(content.question_type || '') && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Jawaabta Saxda ah</label>
                                            <input
                                                type="text"
                                                value={content.correct_answer?.[0]?.text || ''}
                                                onChange={e => setContent({ ...content, correct_answer: [{ id: 'answer', text: e.target.value }] })}
                                                className="w-full p-3 bg-white rounded-xl border border-gray-200 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200"
                                                placeholder={content.question_type === 'code' ? 'Geli koodhka saxda ah...' : 'Geli jawaabta saxda ah...'}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Sharaxaad (Explanation)</label>
                                    <RichTextEditor
                                        content={content.explanation || ''}
                                        onChange={val => setContent({ ...content, explanation: val })}
                                        placeholder="Sharaxaad ku saabsan maxay jawaabta u saxantahay..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* List Content Form */}
                        {content.type === 'list' && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Cinwaanka Liiska</label>
                                    <input
                                        type="text"
                                        value={content.title || ''}
                                        onChange={e => setContent({ ...content, title: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none"
                                        placeholder="Geli cinwaanka..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Waxyaabaha Liiska</label>
                                        <button
                                            type="button"
                                            onClick={() => setContent({ ...content, list_items: [...(content.list_items || []), ''] })}
                                            className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                                        >
                                            + Ku dar shay
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(content.list_items || []).map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={e => {
                                                        const newItems = [...(content.list_items || [])];
                                                        newItems[idx] = e.target.value;
                                                        setContent({ ...content, list_items: newItems });
                                                    }}
                                                    className="flex-1 p-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                                                    placeholder={`Shayga ${idx + 1}...`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setContent({ ...content, list_items: content.list_items?.filter((_, i) => i !== idx) || [] })}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table Content Form */}
                        {(content.type === 'table' || content.type === 'table-grid') && (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Qoraalka Guud</label>
                                    <RichTextEditor
                                        content={content.text || ''}
                                        onChange={val => setContent({ ...content, text: val })}
                                    />
                                </div>

                                {/* Features Editor */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-black text-gray-900 uppercase">Astaamaha (Features)</h5>
                                        <button
                                            type="button"
                                            onClick={() => setContent({ ...content, features: [...(content.features || []), { title: '', text: '' }] })}
                                            className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                                        >
                                            + Ku dar
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(content.features || []).map((feature, idx) => (
                                            <div key={idx} className="space-y-2 p-3 bg-white rounded-xl border border-gray-200">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={e => {
                                                            const newFeatures = [...(content.features || [])];
                                                            newFeatures[idx].title = e.target.value;
                                                            setContent({ ...content, features: newFeatures });
                                                        }}
                                                        className="flex-1 p-2 text-xs font-bold border-b border-gray-100 outline-none"
                                                        placeholder="Cinwaanka..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setContent({ ...content, features: content.features?.filter((_, i) => i !== idx) || [] })}
                                                        className="text-rose-500 p-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={feature.text}
                                                    onChange={e => {
                                                        const newFeatures = [...(content.features || [])];
                                                        newFeatures[idx].text = e.target.value;
                                                        setContent({ ...content, features: newFeatures });
                                                    }}
                                                    className="w-full p-2 text-xs text-gray-600 bg-gray-50/50 rounded-lg outline-none resize-none"
                                                    placeholder="Macluumaadka..."
                                                    rows={2}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Table Data Editor */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 overflow-x-auto">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-black text-gray-900 uppercase">Xogta Jadwalka</h5>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const currentHeader = content.table?.header || [];
                                                    const newHeader = [...currentHeader, `Header ${currentHeader.length + 1}`];
                                                    const newRows = (content.table?.rows || []).map(row => [...row, '']);
                                                    setContent({ ...content, table: { header: newHeader, rows: newRows } });
                                                }}
                                                className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                                            >
                                                + Column
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const headerLen = content.table?.header?.length || 1;
                                                    const newRow = Array(headerLen).fill('');
                                                    const newRows = [...(content.table?.rows || []), newRow];
                                                    setContent({ ...content, table: { ...content.table, header: content.table?.header || ['Header 1'], rows: newRows } });
                                                }}
                                                className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100"
                                            >
                                                + Row
                                            </button>
                                        </div>
                                    </div>

                                    {content.table && (
                                        <table className="w-full border-collapse text-[10px]">
                                            <thead>
                                                <tr>
                                                    {content.table.header.map((h, i) => (
                                                        <th key={i} className="p-1 border border-gray-200">
                                                            <input
                                                                type="text"
                                                                value={h}
                                                                onChange={e => {
                                                                    const newHeader = [...content.table!.header];
                                                                    newHeader[i] = e.target.value;
                                                                    setContent({ ...content, table: { ...content.table!, header: newHeader } });
                                                                }}
                                                                className="w-full bg-transparent font-black text-center outline-none"
                                                            />
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {content.table.rows.map((row, ri) => (
                                                    <tr key={ri}>
                                                        {row.map((cell, ci) => (
                                                            <td key={ci} className="p-1 border border-gray-200">
                                                                <input
                                                                    type="text"
                                                                    value={cell}
                                                                    onChange={e => {
                                                                        const newRows = [...content.table!.rows];
                                                                        newRows[ri][ci] = e.target.value;
                                                                        setContent({ ...content, table: { ...content.table!, rows: newRows } });
                                                                    }}
                                                                    className="w-full bg-transparent outline-none"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Qoraal (Default) Form */}
                        {content.type === 'qoraal' && (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">Cinwaanka (Optional)</label>
                                    <input
                                        type="text"
                                        value={content.title || ''}
                                        onChange={e => setContent({ ...content, title: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                                        placeholder="Tusaale: Maxaad u baahantahay?"
                                    />
                                </div>

                                <div className="flex flex-col gap-6">
                                    {/* Handle Dynamic Ordering */}
                                    {[
                                        { id: 'text', label: 'Macluumaadka Qoraalka' },
                                        { id: 'image', label: 'Sawir (Optional)' }
                                    ].sort((a, b) => {
                                        const isImgTop = content.img_position === 'top';
                                        if (a.id === 'image' && isImgTop) return -1;
                                        if (b.id === 'image' && isImgTop) return 1;
                                        return 0;
                                    }).map((item, index) => (
                                        <Fragment key={item.id}>
                                            {item.id === 'text' ? (
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">{item.label}</label>
                                                    <RichTextEditor
                                                        content={content.text || ''}
                                                        onChange={val => setContent({ ...content, text: val })}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                                        {content.img_url && (
                                                            <button
                                                                onClick={() => setContent({ ...content, img_url: '', img_position: 'bottom' })}
                                                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                                                            >
                                                                Ka saar
                                                            </button>
                                                        )}
                                                    </div>

                                                    {content.img_url ? (
                                                        <div className="space-y-4">
                                                            <img src={content.img_url} alt="Uploaded" className="rounded-xl border border-gray-200 max-h-48 mx-auto" />
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload" disabled={uploadingImage} />
                                                            <label htmlFor="img-upload" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all">
                                                                {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <Plus className="w-6 h-6 text-blue-500" />}
                                                                <span className="text-sm font-bold text-gray-700 mt-2">Soo daji sawir</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Order Switch Button between items */}
                                            {index === 0 && (
                                                <div className="flex justify-center -my-3 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => setContent({
                                                            ...content,
                                                            img_position: content.img_position === 'top' ? 'bottom' : 'top'
                                                        })}
                                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all text-blue-500"
                                                        title="Badel meesha (Switch Order)"
                                                    >
                                                        <ArrowUpDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            />

            <Modal isOpen={showDeleteBlock} onClose={() => setShowDeleteBlock(false)} title="Ma hubtaa?">
                <div className="p-6 text-center">
                    <p className="text-gray-500 mb-8">Ma hubtaa inaad tirtirto qeybtan? Ficilkan lagama noqon karo.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowDeleteBlock(false)} className="flex-1 py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold">Maya</button>
                        <button onClick={handleDeleteBlock} className="flex-1 py-3 px-6 rounded-xl bg-rose-600 text-white font-bold">Haa, Tirtir</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
