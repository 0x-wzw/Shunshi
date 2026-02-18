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
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/40 flex items-center justify-center text-white text-2xl z-50 hover:scale-110 active:scale-95 transition-all"
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-96 max-h-[600px] h-[70vh] glass-dark rounded-[2rem] z-50 flex flex-col overflow-hidden border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <h3 className="font-black text-slate-100 uppercase tracking-widest text-xs">Reflection Assistant</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Non-directive guidance engine</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${m.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10"
                                        : "bg-slate-800/80 text-slate-300 rounded-tl-none border border-white/5"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-6 bg-slate-950/50 border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask for reflection..."
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>
                        <p className="mt-4 text-[9px] text-slate-500 text-center font-bold uppercase tracking-tighter opacity-50">
                            Guidance Only • Decisions remain yours
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}
