"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Copy,
  Trash2,
  Send,
  Loader2,
  MessageSquareText,
  ArrowRight,
} from "lucide-react"; // Added ArrowRight
import type {
  AiGenerateRequest,
  AiGenerateResponse,
} from "@/types/ai-generate";

const CHAT_HISTORY_LOCAL_STORAGE_KEY = "portfolioManagerChatHistory";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
  isLoading?: boolean;
  error?: string;
}

interface ChatSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatSidebar({ className, ...props }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false); // Global loading state for send button
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(
        CHAT_HISTORY_LOCAL_STORAGE_KEY
      );
      if (storedHistory) {
        const parsedHistory: ChatMessage[] = JSON.parse(storedHistory);
        // Basic validation
        if (
          Array.isArray(parsedHistory) &&
          parsedHistory.every(
            (msg) =>
              msg.id &&
              msg.sender &&
              typeof msg.text === "string" &&
              typeof msg.timestamp === "number"
          )
        ) {
          setMessages(parsedHistory);
        } else {
          localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY); // Clear invalid data
        }
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
      localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Only save if there are messages to prevent empty array storage on initial load if history is empty
      try {
        localStorage.setItem(
          CHAT_HISTORY_LOCAL_STORAGE_KEY,
          JSON.stringify(messages)
        );
      } catch (error) {
        console.error("Failed to save chat history to localStorage:", error);
      }
    } else if (localStorage.getItem(CHAT_HISTORY_LOCAL_STORAGE_KEY)) {
      // If messages become empty, clear storage
      localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (): Promise<void> => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isAiResponding) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmedInput,
      timestamp: Date.now(),
    };

    const aiPlaceholderMessageId = (Date.now() + 1).toString();
    const aiPlaceholderMessage: ChatMessage = {
      id: aiPlaceholderMessageId,
      sender: "ai",
      text: "", // Placeholder text or make it empty
      timestamp: Date.now() + 1,
      isLoading: true,
    };

    setMessages((prev) => [...prev, newUserMessage, aiPlaceholderMessage]);
    setInput("");
    setIsAiResponding(true);

    try {
      // Prepare conversation history for context (last 5 messages, excluding the current placeholder)
      const conversationHistory = messages
        .slice(-5) // Get last 5 messages
        .map((msg) => ({ sender: msg.sender, text: msg.text }));

      const requestBody: AiGenerateRequest = {
        taskIdentifier: "general_chat_conversation",
        taskContext: {
          currentUserMessage: trimmedInput,
          conversationHistory: conversationHistory,
        },
      };

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: AiGenerateResponse = await response
          .json()
          .catch(() => ({
            success: false,
            error: "Failed to parse error response.",
          }));
        throw new Error(
          errorData.error ||
            `API Error: ${response.status} ${response.statusText}`
        );
      }

      const result: AiGenerateResponse = await response.json();

      if (result.success && result.data) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiPlaceholderMessageId
              ? {
                  ...msg,
                  text:
                    typeof result.data === "string"
                      ? result.data
                      : JSON.stringify(result.data),
                  isLoading: false,
                  error: undefined,
                }
              : msg
          )
        );
      } else {
        throw new Error(
          result.error || "AI did not return a successful response."
        );
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiPlaceholderMessageId
            ? {
                ...msg,
                text: "Sorry, I encountered an error.",
                isLoading: false,
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : msg
        )
      );
    } finally {
      setIsAiResponding(false);
      textareaRef.current?.focus();
    }
  }, [input, isAiResponding, messages]);

  const handleClearChat = (): void => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY);
  };

  const handleCopyToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Maybe show a toast notification here for feedback
        console.log("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquareText size={20} className="text-primary" />
          <h2 className="text-md font-semibold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          title="Clear chat history"
          disabled={messages.length === 0}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-[1_1_0%] min-h-0 p-3">
          {" "}
          {/* Message display area - takes 1 part of the space */}
          <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                <MessageSquareText size={40} className="mb-2" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-2.5 rounded-lg text-sm break-words shadow-sm relative group",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
                      : "bg-muted text-muted-foreground mr-auto rounded-bl-none",
                    "max-w-[90%]"
                  )}
                >
                  {msg.isLoading && (
                    <div className="flex items-center space-x-1.5">
                      <Loader2
                        size={16}
                        className="animate-spin text-muted-foreground/70"
                      />
                      <span className="text-xs text-muted-foreground/70 italic">
                        AI is thinking...
                      </span>
                    </div>
                  )}
                  {!msg.isLoading && msg.text}
                  {msg.error && (
                    <div className="mt-1.5 p-1.5 bg-destructive/10 text-destructive text-xs rounded flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      <span>Error: {msg.error}</span>
                    </div>
                  )}
                  {!msg.isLoading && (
                    <div className="text-xs mt-1 opacity-70">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  )}
                  {msg.sender === "ai" && !msg.isLoading && !msg.error && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopyToClipboard(msg.text)}
                      title="Copy message"
                    >
                      <Copy size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-end gap-2 p-3 border-t border-border/60 shrink-0">
          {" "}
          {/* Chat input area - Changed to flex-row (gap-2) and items-end */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Chat with AI..."
            className="flex-1 resize-none text-sm leading-relaxed p-2.5 bg-background focus-visible:ring-1 focus-visible:ring-ring min-h-[40px] max-h-[120px]" // Adjusted: flex-1, removed mb-2, added min/max height
            disabled={isAiResponding}
            onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1} // Start with 1 row, will expand
          />
          <Button
            onClick={handleSendMessage}
            size="icon" // Changed to icon button
            className="shrink-0" // Ensure button doesn't shrink
            disabled={isAiResponding || !input.trim()}
            title="Send message"
          >
            {isAiResponding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
