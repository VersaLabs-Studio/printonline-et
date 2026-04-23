// components/chat/MessageList.tsx
"use client";

import React from "react";
import { format } from "date-fns";
import { User, Shield } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
          <User className="text-muted-foreground" size={32} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          No messages yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Send a message to start the conversation
        </p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, msg) => {
    const date = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {});

  const isOwnMessage = (msg: Message) => msg.sender_id === currentUserId;

  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="space-y-3">
          {/* Date separator */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-border/20" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              {format(new Date(date), 'MMMM dd, yyyy')}
            </span>
            <div className="flex-1 h-px bg-border/20" />
          </div>

          {/* Messages for this date */}
          {msgs.map((msg, idx) => {
            const isOwn = isOwnMessage(msg);
            const showAvatar = idx === 0 || !isOwnMessage(msgs[idx - 1]) !== !isOwn;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                  showAvatar ? 'mt-4' : 'mt-1'
                }`}
              >
                <div className={`flex max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  {/* Avatar */}
                  {showAvatar && (
                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.is_admin 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {msg.is_admin ? <Shield size={16} /> : <User size={16} />}
                    </div>
                  )}
                  {!showAvatar && <div className="w-8" />}

                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : msg.is_admin
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    <div className={`flex items-center gap-2 mt-1 ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                        isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground/60'
                      }`}>
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </span>
                      {msg.is_admin && !isOwn && (
                        <span className="text-[9px] font-bold text-primary uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
