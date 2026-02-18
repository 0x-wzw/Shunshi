"use client";

import { useState, useRef, useEffect } from "react";
import { InterpretationReport } from "@/lib/interpretation/types";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatInterface({ report }: { report: InterpretationReport }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am your Reflection Assistant. How can I help you mirror your BaZi insights in your daily life today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, context: report }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble reflecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#111827] shadow-2xl flex items-center justify-center text-white text-2xl z-50 hover:scale-110 active:scale-95 transition-all"
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-96 max-h-[600px] h-[70vh] bg-white border border-slate-200 rounded-[2.5rem] z-50 flex flex-col overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-8 duration-300">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Reflection Assistant</h3>
                        <p className="text-[9px] text-slate-500 font-bold tracking-tighter mt-1 opacity-70">CONFIDENTIAL INTELLIGENCE • NON-DIRECTIVE</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-[11px] font-medium leading-relaxed shadow-sm ${m.role === "user"
                                        ? "bg-slate-900 text-white rounded-tr-none"
                                        : "bg-white text-slate-600 rounded-tl-none border border-slate-100"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 p-4 rounded-full px-6">
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-100">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Ask for reflection..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400 font-medium"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-2.5 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>
                        <p className="mt-6 text-[8px] text-slate-400 text-center font-black uppercase tracking-[0.2em] opacity-50">
                            Guidance Only • Intelligence Support
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}
