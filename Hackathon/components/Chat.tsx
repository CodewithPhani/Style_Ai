
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, ChatMessage } from '../types';

const Chat: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: `Hello ${user.name.split(' ')[0]}, I'm your dedicated StyleSense assistant. I'm ready to provide technical advice on **${user.preferences?.gender}** fashion and **${user.preferences?.skinTone}** skintone routines. How can I assist your wardrobe today?` }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatSession = useMemo(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({ 
      model: 'gemini-3-flash-preview',
      config: { 
        systemInstruction: `You are StyleSense Assistant, a top-tier technical fashion consultant. 
        USER PROFILE: Gender is **${user.preferences?.gender}**, Skin Tone is **${user.preferences?.skinTone}**.
        CRITICAL: Provide technical clothing names (e.g., 'relaxed tapered chinos', 'bootcut dark wash jeans').
        SKINCARE: Suggest routines for **${user.preferences?.skinTone}** skin.
        FORMAT: Use Markdown. Always include Google Shopping redirect links for all items suggested.` 
      }
    });
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message: input });
      const modelMsg: ChatMessage = { role: 'model', parts: [{ text: response.text || "" }] };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      setError("Consultation temporarily interrupted. Please try again.");
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I'm having trouble connecting to my creative engine. Please check your connection." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col glass rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
      <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">Style Advisor</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Technical Fashion Specialist</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm ${m.role === 'user' ? 'bg-black text-white rounded-tr-none shadow-xl' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.parts[0].text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-2 h-2 bg-black/20 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-black/20 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-black/20 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-8 bg-white/60 border-t border-gray-100">
        {error && <p className="text-[10px] text-red-500 font-bold uppercase mb-2 text-center">{error}</p>}
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask for technical style or skincare advice..."
            className="w-full pl-8 pr-16 py-5 bg-white rounded-full outline-none focus:ring-2 focus:ring-black transition-all shadow-sm border border-gray-100"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center transition-all disabled:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
