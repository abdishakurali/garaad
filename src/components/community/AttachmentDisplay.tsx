import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, Video, File, Eye, X } from 'lucide-react';
import { CommunityAttachment } from '@/types/community';
import { getMediaUrl } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AttachmentDisplayProps {
    attachments: CommunityAttachment[];
}

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet;
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return FileText;
    return File;
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

export const AttachmentDisplay: React.FC<AttachmentDisplayProps> = ({ attachments }) => {
    const [previewAttachment, setPreviewAttachment] = useState<CommunityAttachment | null>(null);

    if (!attachments || attachments.length === 0) return null;

    const handleDownload = (attachment: CommunityAttachment) => {
        const url = getMediaUrl(attachment.file, 'community_attachments');
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-3 space-y-2">
            {attachments.map((attachment) => {
                const Icon = getFileIcon(attachment.file_type || '');
                const fileExt = getFileExtension(attachment.name || '');
                const fileSize = formatFileSize(attachment.size || 0);
                const isImage = attachment.file_type?.startsWith('image/');
                const isPDF = attachment.file_type?.includes('pdf');
                const isVideo = attachment.file_type?.startsWith('video/');
                const canPreview = isImage || isPDF || isVideo;

                return (
                    <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                        {/* File Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {attachment.name || 'Unnamed file'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {fileExt} • {fileSize}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canPreview && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                                    onClick={() => setPreviewAttachment(attachment)}
                                    title="Preview file"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                onClick={() => handleDownload(attachment)}
                                title="Download file"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}

            {/* Preview Modal */}
            <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
                <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-gray-900 border-none shadow-2xl">
                    <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            {previewAttachment && (
                                <div className="p-2 rounded-lg bg-primary/10">
                                    {React.createElement(getFileIcon(previewAttachment.file_type || ''), { className: "w-5 h-5 text-primary" })}
                                </div>
                            )}
                            <DialogTitle className="text-base font-semibold truncate max-w-[50vw]">
                                {previewAttachment?.name}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 bg-muted/20 flex items-center justify-center overflow-auto p-4">
                        {previewAttachment && (
                            <>
                                {previewAttachment.file_type?.startsWith('image/') && (
                                    <img
                                        src={getMediaUrl(previewAttachment.file, 'community_attachments')}
                                        alt={previewAttachment.name}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                )}
                                {previewAttachment.file_type?.includes('pdf') && (
                                    <iframe
                                        src={`${getMediaUrl(previewAttachment.file, 'community_attachments')}#toolbar=0`}
                                        className="w-full h-full rounded-lg border-none"
                                        title={previewAttachment.name}
                                    />
                                )}
                                {previewAttachment.file_type?.startsWith('video/') && (
                                    <video
                                        src={getMediaUrl(previewAttachment.file, 'community_attachments')}
                                        controls
                                        className="max-w-full max-h-full rounded-lg shadow-lg"
                                        autoPlay
                                    />
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
