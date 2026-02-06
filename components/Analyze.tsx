
import React, { useState, useRef } from 'react';
import { analyzeLook } from '../services/gemini';
import { db } from '../services/db';
import { User, AnalysisResponse } from '../types';

const Analyze: React.FC<{ user: User }> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await analyzeLook(image, user);
      setAnalysis(res);
      db.saveToHistory(user.id, { type: 'analysis', ...res, image: image });
    } catch (e: any) {
      const msg = e.message || "";
      if (msg.includes('429') || msg.includes('quota')) {
        setError("QUOTA_EXCEEDED");
      } else if (msg.includes('503') || msg.includes('overloaded') || msg.includes('UNAVAILABLE')) {
        setError("SERVER_OVERLOADED");
      } else if (msg.includes('API key not valid') || msg.includes('400')) {
        setError("INVALID_KEY");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-6xl italic">Technical Blueprint</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-300">Resilient Style Intelligence</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* INPUT SECTION */}
        <div className="space-y-8 sticky top-28">
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="aspect-[3/4] bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100 cursor-pointer overflow-hidden flex flex-col items-center justify-center hover:border-black transition-all group shadow-inner relative"
          >
            {image ? <img src={image} className="w-full h-full object-cover" alt="Selected" /> : (
              <div className="text-center space-y-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em]">Upload Reference</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImage(reader.result as string);
                  setAnalysis(null);
                  setError(null);
                };
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
          </div>

          {error && (
            <div className="p-10 bg-red-50 border border-red-100 rounded-[3.5rem] text-center space-y-6 shadow-xl animate-fade-in">
              {error === "QUOTA_EXCEEDED" ? (
                <>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Daily Limit Reached</p>
                  <p className="text-[10px] text-red-400 font-bold leading-relaxed px-4">The free AI engine is out of tokens for today. Switch project or wait 24h.</p>
                  <button onClick={handleOpenKeySelector} className="px-10 py-4 bg-red-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Change API Key</button>
                </>
              ) : error === "SERVER_OVERLOADED" ? (
                <>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Stylist Engine Busy</p>
                  <p className="text-[10px] text-red-400 font-bold leading-relaxed px-4">Google's servers are currently overloaded. We will try a different pathway.</p>
                  <button onClick={handleAnalyze} className="px-10 py-4 bg-red-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Retry Analysis</button>
                </>
              ) : error === "INVALID_KEY" ? (
                <>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Authentication Error</p>
                  <p className="text-[10px] text-red-400 font-bold leading-relaxed px-4">Your current API key is invalid or has expired.</p>
                  <button onClick={handleOpenKeySelector} className="px-10 py-4 bg-red-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Reconnect Key</button>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-red-600 tracking-wide leading-relaxed">System Interruption</p>
                  <p className="text-[9px] text-red-400 font-mono break-all px-4">{error}</p>
                  <button onClick={handleAnalyze} className="px-10 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Attempt Restart</button>
                </div>
              )}
            </div>
          )}

          <button 
            disabled={!image || loading} 
            onClick={handleAnalyze} 
            className="w-full py-7 bg-black text-white font-bold tracking-[0.2em] uppercase rounded-full disabled:bg-gray-100 shadow-2xl transition-all"
          >
            {loading ? 'Consulting Multi-Engine Cluster...' : 'Generate Technical Blueprint'}
          </button>
        </div>

        {/* RESULTS SECTION */}
        <div className="space-y-12">
          {analysis ? (
            <div className="animate-fade-in space-y-16">
              {/* Visual Manifest */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold">M</div>
                   <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Aesthetic Manifest</h3>
                </div>
                <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 prose prose-sm max-w-none text-gray-500 leading-loose italic text-lg shadow-sm">
                  {analysis.evolvedLookDescription}
                </div>
              </div>

              {/* Grooming Section */}
              <div className="p-10 bg-black text-white rounded-[4rem] shadow-2xl space-y-12 overflow-hidden relative">
                <div className="space-y-8 relative z-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 border-b border-white/10 pb-4">Master Barber Blueprint</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold opacity-40">Target Cut</p>
                      <p className="text-2xl font-serif italic text-white">{analysis.grooming.hairstyle}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold opacity-40">Beard Grooming</p>
                      <p className="text-2xl font-serif italic text-white">{analysis.grooming.beardStyle}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <p className="text-xs opacity-70 italic font-medium">"Tell your Barber: {analysis.grooming.saloonAdvice}"</p>
                  </div>
                </div>
              </div>

              {/* Skincare Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold">D</div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Dermatological Strategy</h3>
                </div>
                
                <div className="p-10 bg-gray-50 rounded-[4rem] border border-gray-100 space-y-10 shadow-sm">
                  <div className="space-y-4">
                    <p className="text-lg font-serif italic text-gray-800 leading-relaxed">{analysis.skincare.advice}</p>
                    <div className="flex flex-wrap gap-3">
                      {analysis.skincare.routine.map((step, i) => (
                        <span key={i} className="px-5 py-2 bg-white border border-gray-100 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-500 shadow-sm">{step}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Recommended Products</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {analysis.skincare.products.map((prod, i) => (
                        <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col justify-between hover:border-black transition-all group shadow-sm">
                          <div>
                            <p className="text-[9px] uppercase font-black text-gray-300 mb-1 group-hover:text-black transition-colors">{prod.brand}</p>
                            <p className="text-sm font-bold mb-4">{prod.name}</p>
                          </div>
                          <a href={prod.shopUrl} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase border-b border-black w-fit group-hover:gap-4 transition-all">
                            Shop Item
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Wardrobe Redirect Grid */}
              <div className="space-y-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-4">Technical Wardrobe Redirects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysis.wardrobe.map((item, i) => (
                    <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-black transition-all group flex flex-col justify-between shadow-sm">
                      <div>
                        <p className="text-[9px] uppercase font-black text-gray-300 mb-2 group-hover:text-black transition-colors">{item.category}</p>
                        <p className="text-sm font-bold mb-4">{item.recommendation}</p>
                      </div>
                      <a href={item.shopUrl} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase border-b border-black w-fit group-hover:gap-4 transition-all">
                        Redirect to Shop
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[4rem] bg-gray-50/30 text-center p-16">
               {loading ? (
                 <div className="space-y-6">
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Navigating Server Load...</p>
                 </div>
               ) : (
                 <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-200 leading-loose text-center">Upload an image to unlock your total<br/>grooming, skincare, and technical wardrobe blueprint.</p>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;
