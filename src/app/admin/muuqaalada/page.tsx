"use client";

import { useState, useEffect, useRef } from "react";
import { adminApi as api, ApiError } from "@/lib/admin-api";
import { Upload, Video, Trash2, Play, Pause, X, Search, Filter, Loader2 } from "lucide-react";

interface UploadedVideo {
    id: number;
    title: string;
    description: string;
    storage_backend: string;
    telegram_file_id: string;
    telegram_message_id: string;
    video_url: string;
    thumbnail_url: string;
    duration: number;
    file_size: number;
    width: number;
    height: number;
    format: string;
    created_at: string;
    uploaded_by: number;
}

export default function VideoManagementPage() {
    const [videos, setVideos] = useState<UploadedVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<UploadedVideo | null>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload queue state
    const [uploadQueue, setUploadQueue] = useState<{ file: File; status: 'pending' | 'uploading' | 'completed' | 'error'; error?: string }[]>([]);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

    // Form state (single upload)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await api.get("/lms/videos/");
            setVideos(response.data);
        } catch (err) {
            console.error("Error fetching videos:", err);
            setError("Lama soo qaadan karo muuqaalada");
        } finally {
            setLoading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            console.log('files dropped', e.dataTransfer.files);
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (files: FileList | File[]) => {
        const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
        const maxSize = 2 * 1024 * 1024 * 1024;
        const newQueueItems = [];
        let hasError = false;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!allowedTypes.includes(file.type)) {
                setError("Nooca faylka lama oggola: " + file.name);
                hasError = true;
                continue;
            }
            if (file.size > maxSize) {
                setError("Faylka aad u weyn: " + file.name);
                hasError = true;
                continue;
            }
            newQueueItems.push({ file, status: 'pending' as const });
        }

        if (newQueueItems.length > 0) {
            setUploadQueue(prev => [...prev, ...newQueueItems]);
            setError("");
        }
    };

    const processQueue = async () => {
        if (uploadQueue.length === 0 || isProcessingQueue) return;

        setIsProcessingQueue(true);
        setUploading(true);

        for (let i = 0; i < uploadQueue.length; i++) {
            if (uploadQueue[i].status === 'completed') continue;

            setCurrentUploadIndex(i);
            const item = uploadQueue[i];

            // Update status to uploading
            setUploadQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'uploading' } : q));
            setUploadProgress(0);

            try {
                const formData = new FormData();
                formData.append("video", item.file);
                // Use existing title logic only if single file and title input is set, otherwise default to filename
                const fileTitle = (uploadQueue.length === 1 && title) ? title : item.file.name.replace(/\.[^/.]+$/, "");
                formData.append("title", fileTitle);
                if (description) formData.append("description", description);

                await api.post("/lms/videos/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    },
                });

                // Mark as completed
                setUploadQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'completed' } : q));
                setSuccess(`${item.file.name} way soo degtay!`);
            } catch (err: any) {
                console.error("Upload error:", err);
                setUploadQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'error', error: 'Failed' } : q));
            }
        }

        setIsProcessingQueue(false);
        setUploading(false);
        setUploadProgress(0);
        await fetchVideos();

        // Clear queue after delay if all valid
        if (uploadQueue.every(q => q.status === 'completed')) {
            setTimeout(() => {
                setShowUploadForm(false);
                setUploadQueue([]);
                setTitle("");
                setDescription("");
                setSuccess("");
            }, 1000); // Wait a sec to show 100%
        }
    };

    const handleDelete = async (videoId: number) => {
        if (!confirm("Ma hubtaa inaad tirtirto muuqaalkan?")) {
            return;
        }

        try {
            await api.delete(`/lms/videos/${videoId}/`);
            setSuccess("Muuqaalka waa la tirtiray");
            setVideos(videos.filter((v) => v.id !== videoId));
            if (selectedVideo?.id === videoId) {
                setSelectedVideo(null);
            }
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Delete error:", err);
            setError("Lama tirtiri karin muuqaalka");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const filteredVideos = videos.filter(
        (video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Video className="w-8 h-8 text-blue-600" />
                        Maamulka Muuqaalada
                    </h1>
                    <p className="text-gray-500 font-medium">Soo geli oo maamul muuqaalada koorsooyinka.</p>
                </div>
                <button
                    onClick={() => setShowUploadForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                    <Upload className="w-5 h-5" />
                    Soo Geli Muuqaal
                </button>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm animate-fade-in">
                    {success}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm animate-fade-in">
                    {error}
                </div>
            )}

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Raadi muuqaalada..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <p className="text-gray-500 text-lg font-medium">
                        {searchQuery ? "Lama helin muuqaalo" : "Weli muuqaalo lama soo gelin"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <div
                            key={video.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                {video.thumbnail_url ? (
                                    <img
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <Video className="w-12 h-12 text-gray-200" />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                                    {formatDuration(video.duration || 0)}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-gray-900 font-bold mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {video.title}
                                </h3>
                                {video.description && (
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {video.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                    <span>{formatFileSize(video.file_size || 0)}</span>
                                    <span>{video.format}</span>
                                </div>
                                <div className="mt-4 pt-4 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(video.id);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Tirtir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showUploadForm && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Soo Geli Muuqaal Cusub</h2>
                            <button
                                onClick={() => {
                                    setShowUploadForm(false);
                                    setSelectedFile(null);
                                    setTitle("");
                                    setDescription("");
                                    setError("");
                                }}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Drag & Drop Zone */}
                            <div
                                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${dragActive
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
                                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                                    className="hidden"
                                />

                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-bold mb-2 text-lg">Jiid oo halkan dhig muuqaalada</p>
                                <p className="text-gray-500 mb-6 font-medium">ama guji badhanka hoose si aad u doorato (Multiple)</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Dooro Faylal
                                </button>
                                <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
                                    MP4, WebM, MOV, AVI, MKV (Max 2GB per file)
                                </p>
                            </div>

                            {/* Queue List */}
                            {uploadQueue.length > 0 && (
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    <h4 className="font-bold text-sm text-gray-900 sticky top-0 bg-white pb-2 border-b border-gray-100">
                                        Safuufka ({uploadQueue.length})
                                    </h4>
                                    {uploadQueue.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                {item.status === 'completed' ? (
                                                    <div className="text-green-600 font-bold">✓</div>
                                                ) : item.status === 'error' ? (
                                                    <div className="text-red-600 font-bold">!</div>
                                                ) : (
                                                    <Video className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-gray-900 truncate">{item.file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>

                                                {item.status === 'uploading' && (
                                                    <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                                    </div>
                                                )}
                                            </div>
                                            {item.status === 'pending' && (
                                                <button
                                                    onClick={() => setUploadQueue(prev => prev.filter((_, i) => i !== idx))}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Global Progress or Controls */}
                            <div className="pt-4 border-t border-gray-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={processQueue}
                                    disabled={uploading || uploadQueue.length === 0 || uploadQueue.every(i => i.status === 'completed')}
                                    className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Soo gelinaya ({currentUploadIndex + 1}/{uploadQueue.length})...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            <span>Bilow Upload ({uploadQueue.length})</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedVideo && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h2>
                                    {selectedVideo.description && (
                                        <p className="text-gray-500 font-medium leading-relaxed">{selectedVideo.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-8 rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
                                <video
                                    src={selectedVideo.video_url}
                                    controls
                                    className="w-full h-full"
                                    autoPlay
                                >
                                    Browserkaagu ma taageerayo video tag.
                                </video>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Cabbirka", value: formatFileSize(selectedVideo.file_size || 0) },
                                    { label: "Mudada", value: formatDuration(selectedVideo.duration || 0) },
                                    { label: "Nooca", value: selectedVideo.format.toUpperCase() },
                                    { label: "Qaabka", value: `${selectedVideo.width}x${selectedVideo.height}` }
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-gray-900 font-bold">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
