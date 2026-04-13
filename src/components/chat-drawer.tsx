// src/components/chat-drawer.tsx
"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChatDrawerProps {
  context: string;
}

export function ChatDrawer({ context }: ChatDrawerProps) {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: { context },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  }

  return (
    <Sheet>
      <SheetTrigger
        className="fixed bottom-6 right-6 rounded-2xl h-14 w-14 shadow-lg bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-xl"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[480px] flex flex-col bg-card border-l border-border/60">
        <SheetHeader className="border-b border-border/60 pb-4">
          <SheetTitle className="font-serif text-xl">Ask about your home</SheetTitle>
          <p className="text-sm text-muted-foreground">Get answers based on your diagnosis results</p>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4 py-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Ask any question about your home diagnosis</p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {m.parts
                    ?.filter((p) => p.type === "text")
                    .map((p, i) => (
                      <span key={i}>{p.text}</span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-border/60">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What should I prioritize first?"
            disabled={isLoading}
            className="h-11 bg-background border-border/80"
          />
          <Button type="submit" disabled={isLoading} className="h-11 px-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
