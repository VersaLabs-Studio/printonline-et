// components/chat/MessageList.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { User, Shield, Check, CheckCheck, FileText, Download, ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageAttachment } from "@/lib/supabase/messages";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
  attachments?: MessageAttachment[];
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM dd, yyyy");
}

function getInitials(name: string): string {
  return name?.charAt(0)?.toUpperCase() || "?";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentPreview({ attachment }: { attachment: MessageAttachment }) {
  const isImage = attachment.category === "image";
  const isVideo = attachment.category === "video";

  if (isImage) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 rounded-xl overflow-hidden border border-white/20 hover:opacity-90 transition-opacity max-w-[240px]"
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-[200px] w-auto object-cover"
          loading="lazy"
        />
      </a>
    );
  }

  if (isVideo) {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-white/20 max-w-[280px]">
        <video
          src={attachment.url}
          controls
          className="max-h-[200px] w-full"
          preload="metadata"
        />
      </div>
    );
  }

  // Document
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-colors max-w-[280px] group"
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{attachment.name}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </a>
  );
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="h-16 w-16 bg-muted/30 rounded-2xl flex items-center justify-center mb-4">
          <MessageSquareIcon className="text-muted-foreground/40" size={32} />
        </div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          No messages yet
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Send a message or attach a file to start the conversation
        </p>
      </div>
    );
  }

  // Group messages by date
  const grouped: Record<string, Message[]> = {};
  messages.forEach((msg) => {
    const dateKey = format(new Date(msg.created_at), "yyyy-MM-dd");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(msg);
  });

  const isOwn = (msg: Message) => msg.sender_id === currentUserId;

  return (
    <div className="flex flex-col gap-1 px-2 py-4">
      {Object.entries(grouped).map(([dateKey, msgs]) => (
        <div key={dateKey} className="flex flex-col gap-1">
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 rounded-full bg-muted/40">
              {formatMessageDate(dateKey)}
            </span>
          </div>

          {msgs.map((msg, idx) => {
            const own = isOwn(msg);
            const prevMsg = idx > 0 ? msgs[idx - 1] : null;
            const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id;
            const unread = !msg.read_at && !own;
            const hasText = msg.message?.trim().length > 0;
            const hasAttachments = msg.attachments && msg.attachments.length > 0;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 max-w-[85%] mb-1",
                  own ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                )}
              >
                {/* Avatar */}
                {showAvatar ? (
                  <div
                    className={cn(
                      "shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold select-none",
                      msg.is_admin
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border border-border/40"
                    )}
                    title={msg.is_admin ? "Admin" : "Customer"}
                  >
                    {msg.is_admin ? <Shield size={14} /> : <User size={14} />}
                  </div>
                ) : (
                  <div className="w-8 shrink-0" />
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    "flex flex-col rounded-2xl px-4 py-2.5 min-w-0",
                    own
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : msg.is_admin
                      ? "bg-primary/5 text-foreground border border-primary/15 rounded-bl-md"
                      : "bg-muted text-foreground rounded-bl-md",
                    unread && !own && "ring-2 ring-primary/20"
                  )}
                >
                  {/* Sender label for first message in group */}
                  {showAvatar && !own && (
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider mb-1",
                      msg.is_admin ? "text-primary" : "text-muted-foreground"
                    )}>
                      {msg.is_admin ? "Admin" : "Customer"}
                    </span>
                  )}

                  {/* Unread badge */}
                  {unread && (
                    <span className="self-start mb-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-wider">
                      New
                    </span>
                  )}

                  {/* Text content */}
                  {hasText && (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {msg.message}
                    </p>
                  )}

                  {/* Attachments */}
                  {hasAttachments && msg.attachments!.map((att, i) => (
                    <AttachmentPreview key={i} attachment={att} />
                  ))}

                  {/* Meta row */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 mt-1.5",
                      own ? "justify-end" : "justify-start"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-wider",
                        own ? "text-primary-foreground/50" : "text-muted-foreground/60"
                      )}
                    >
                      {format(new Date(msg.created_at), "h:mm a")}
                    </span>

                    {/* Read receipt (own messages only) */}
                    {own && (
                      <span className="text-primary-foreground/50">
                        {msg.read_at ? (
                          <CheckCheck size={12} className="text-emerald-300" />
                        ) : (
                          <Check size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageSquareIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
