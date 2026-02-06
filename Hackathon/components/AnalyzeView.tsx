
import React, { useState, useRef, useEffect } from 'react';
import { analyzeLook } from '../services/gemini';
import { AnalysisResponse, GenerationState, User } from '../types';

const AnalyzeView: React.FC<{ user: User }> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [state, setState] = useState<GenerationState<AnalysisResponse>>({
    loading: false,
    error: null,
    result: null,
    visualUrl: null,
    visualizing: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setState(prev => ({ ...prev, result: null, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || cooldown > 0) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const analysis = await analyzeLook(image, user);
      setState({ loading: false, error: null, result: analysis, visualUrl: null, visualizing: false });
      setCooldown(20);
    } catch (err: any) {
      setState({ loading: false, error: err.message, result: null });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-5xl italic">Vision Analysis</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Technical Style Blueprinting</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6 sticky top-24">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-[3/4] border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-black ${image ? 'border-none shadow-2xl' : ''}`}
          >
            {image ? <img src={image} className="w-full h-full object-cover" /> : <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 text-center">Drop Look Here<br/>for Technical Upgrade</p>}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || state.loading || cooldown > 0}
            className="w-full py-5 bg-black text-white rounded-full font-bold tracking-[0.2em] uppercase disabled:bg-gray-100 shadow-xl"
          >
            {state.loading ? 'Processing Blueprint...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Analyze Style'}
          </button>
        </div>

        <div className="space-y-12">
          {state.error && <div className="p-10 bg-red-50 text-red-600 rounded-[3rem] text-[10px] font-bold uppercase tracking-widest text-center">{state.error}</div>}

          {state.result && (
            <div className="space-y-12 animate-fade-in">
              <div>
                <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Detected Aesthetic</h3>
                <p className="text-3xl font-serif font-bold italic">{state.result.styleAesthetic}</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 text-gray-600">
                 <p className="italic leading-relaxed">"{state.result.skintoneAnalysis}"</p>
                 <div className="flex gap-2 mt-4">
                   {state.result.palette.map((c, i) => <div key={i} className="w-6 h-6 rounded-full shadow-sm" style={{backgroundColor: c}} />)}
                 </div>
              </div>

              <div className="p-10 bg-black text-white rounded-[3rem] space-y-6">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Evolved Concept</h4>
                 <p className="text-lg font-serif italic leading-relaxed">{state.result.evolvedLookDescription}</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Blueprint Redirects</h4>
                <div className="grid gap-3">
                  {state.result.suggestions.map((item, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex justify-between items-center shadow-sm hover:border-black transition-all group">
                       <p className="text-sm font-bold flex-1 pr-4">{item.text}</p>
                       <a href={item.shopUrl} target="_blank" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                       </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeView;
