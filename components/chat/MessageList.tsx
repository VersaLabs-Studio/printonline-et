// components/chat/MessageList.tsx
"use client";

import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { User, Shield, Check, CheckCheck, FileText, Download } from "lucide-react";
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
  currentUserIsAdmin?: boolean;
}

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM dd, yyyy");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentPreview({ attachment, isOwn }: { attachment: MessageAttachment; isOwn: boolean }) {
  const isImage = attachment.category === "image";
  const isVideo = attachment.category === "video";

  if (isImage) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block mt-1.5 rounded-lg overflow-hidden hover:opacity-90 transition-opacity",
          isOwn ? "border border-white/20" : "border border-border/40"
        )}
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-[180px] w-auto object-cover"
          loading="lazy"
        />
      </a>
    );
  }

  if (isVideo) {
    return (
      <div className="mt-1.5 rounded-lg overflow-hidden border border-border/40">
        <video
          src={attachment.url}
          controls
          className="max-h-[180px] w-full"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2.5 mt-1.5 p-2.5 rounded-lg transition-colors group",
        isOwn
          ? "bg-white/10 hover:bg-white/20"
          : "bg-muted hover:bg-muted/80 border border-border/30"
      )}
    >
      <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
        <FileText size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-semibold truncate", isOwn ? "text-primary-foreground" : "text-foreground")}>
          {attachment.name}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </a>
  );
}

export function MessageList({ messages, currentUserId, currentUserIsAdmin }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="h-14 w-14 bg-muted/30 rounded-xl flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/40"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
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

  // Group messages by date for date separators
  const grouped: Record<string, Message[]> = {};
  messages.forEach((msg) => {
    const dateKey = format(new Date(msg.created_at), "yyyy-MM-dd");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(msg);
  });

  return (
    <div className="space-y-1 px-2 py-4 w-full min-w-0">
      {Object.entries(grouped).map(([dateKey, msgs]) => (
        <React.Fragment key={dateKey}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 rounded-full bg-muted/50">
              {formatMessageDate(dateKey)}
            </span>
          </div>

          {msgs.map((msg, idx) => {
            const ownBySender = msg.sender_id === currentUserId;
            const own = currentUserIsAdmin !== undefined
              ? ownBySender && msg.is_admin === currentUserIsAdmin
              : ownBySender;
            const prev = idx > 0 ? msgs[idx - 1] : null;
            const showAvatar = !prev || prev.sender_id !== msg.sender_id;
            const isUnread = !msg.read_at && !own;
            const hasText = msg.message?.trim().length > 0;
            const hasAttachments = msg.attachments && msg.attachments.length > 0;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: own ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div className={cn("flex gap-2 max-w-[80%]", own ? "flex-row-reverse" : "flex-row")}>
                  {/* Avatar */}
                  {showAvatar ? (
                    <div
                      className={cn(
                        "shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold select-none mt-1",
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

                  {/* Bubble column */}
                  <div className="flex flex-col">
                    {/* Sender label for received messages */}
                    {showAvatar && !own && (
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider mb-0.5 px-1",
                        msg.is_admin ? "text-primary" : "text-muted-foreground"
                      )}>
                        {msg.is_admin ? "Admin" : "Customer"}
                      </span>
                    )}

                    {/* Unread badge */}
                    {isUnread && (
                      <span className="self-start mb-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5",
                        own
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : msg.is_admin
                          ? "bg-amber-50 text-foreground border border-amber-200 rounded-bl-md"
                          : "bg-muted text-foreground rounded-bl-md",
                        isUnread && !own && "ring-2 ring-primary/30"
                      )}
                    >
                      {hasText && (
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {msg.message}
                        </p>
                      )}

                      {hasAttachments && msg.attachments!.map((att, i) => (
                        <AttachmentPreview key={i} attachment={att} isOwn={own} />
                      ))}
                    </div>

                    {/* Meta row */}
                    <div className={cn("flex items-center gap-1 mt-0.5", own ? "justify-end" : "justify-start")}>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        {format(new Date(msg.created_at), "h:mm a")}
                      </span>
                      {own && (
                        <span className="text-muted-foreground/50">
                          {msg.read_at ? (
                            <CheckCheck size={11} className="text-emerald-500" />
                          ) : (
                            <Check size={11} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
