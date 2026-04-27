// components/chat/MessageInput.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, ImageIcon, Film, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MessageAttachment } from "@/lib/supabase/messages";

interface MessageInputProps {
  onSend: (message: string, attachments: MessageAttachment[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  onUploadFile?: (file: File) => Promise<{ attachment: MessageAttachment | null; error: string | null }>;
}

const MAX_TOTAL_ATTACHMENTS = 5;

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon size={14} />;
  if (type.startsWith("video/")) return <Film size={14} />;
  return <FileText size={14} />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageInput({
  onSend,
  isLoading,
  placeholder = "Type your message...",
  onUploadFile,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const hasText = message.trim().length > 0;
    const hasFiles = attachments.length > 0;
    if ((hasText || hasFiles) && !isLoading) {
      onSend(hasText ? message.trim() : "", attachments);
      setMessage("");
      setAttachments([]);
      setUploadError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      if (!onUploadFile) return;

      setUploadError(null);

      for (const file of Array.from(files)) {
        if (attachments.length + Array.from(uploadingFiles).length >= MAX_TOTAL_ATTACHMENTS) {
          setUploadError(`Max ${MAX_TOTAL_ATTACHMENTS} files per message`);
          break;
        }

        const fileKey = `${file.name}-${Date.now()}`;
        setUploadingFiles((prev) => new Set(prev).add(fileKey));

        const { attachment, error } = await onUploadFile(file);

        setUploadingFiles((prev) => {
          const next = new Set(prev);
          next.delete(fileKey);
          return next;
        });

        if (error) {
          setUploadError(error);
        } else if (attachment) {
          setAttachments((prev) => [...prev, attachment]);
        }
      }

      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [attachments, uploadingFiles, onUploadFile]
  );

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  const isBusy = isLoading || uploadingFiles.size > 0;
  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isBusy;

  return (
    <div className="flex flex-col gap-2">
      {/* Attachment previews */}
      {(attachments.length > 0 || uploadingFiles.size > 0) && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border/40 text-xs"
            >
              <span className="text-primary">{getFileIcon(att.type)}</span>
              <span className="font-medium truncate max-w-[120px]">{att.name}</span>
              <span className="text-muted-foreground text-[10px]">{formatFileSize(att.size)}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                type="button"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {Array.from(uploadingFiles).map((key) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/30 text-xs"
            >
              <Loader2 size={12} className="animate-spin text-primary" />
              <span className="text-muted-foreground">Uploading...</span>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">
          <AlertCircle size={12} />
          {uploadError}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf,application/zip,application/postscript"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy || !onUploadFile}
          type="button"
        >
          <Paperclip size={18} className="text-muted-foreground" />
        </Button>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[44px] max-h-[120px] resize-none rounded-xl text-sm"
          disabled={isBusy}
          maxLength={2000}
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "h-10 w-10 rounded-xl shrink-0 transition-all",
            canSend ? "btn-pana" : "bg-muted text-muted-foreground"
          )}
          size="icon"
          type="button"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      </div>
    </div>
  );
}
