
import React, { useState, useRef } from 'react';
import { getStylingAdvice } from '../services/gemini';
import { RecommendationResponse, GenerationState, User } from '../types';

const SuggestView: React.FC<{ user: User }> = ({ user }) => {
  const [interest, setInterest] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [state, setState] = useState<GenerationState<RecommendationResponse>>({
    loading: false,
    error: null,
    result: null,
    visualUrl: null,
    visualizing: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSuggest = async () => {
    if (!interest && !image) return;

    setState(prev => ({ ...prev, loading: true, error: null, result: null }));
    
    try {
      const result = await getStylingAdvice(user, {
        occasion: 'Style Discovery',
        weather: 'Current',
        location: 'Local',
        styleVibe: interest
      }, image || undefined);
      
      setState(prev => ({ ...prev, loading: false, result }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-fade-in pb-20">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-6xl italic">Style Curator</h2>
        <div className="flex justify-center items-center gap-2">
           <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase text-center">Intelligent Text-Based Styling</p>
        </div>
      </div>

      <div className="glass p-12 rounded-[4rem] space-y-12 shadow-2xl border border-white">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desired Aesthetic</label>
            <input 
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g. Quiet Luxury, Minimalist..."
              className="w-full bg-transparent border-b-2 border-gray-100 py-6 focus:outline-none focus:border-black transition-all text-2xl font-serif italic"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inspiration (Optional)</label>
            <div className="flex items-center gap-8">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-10 py-5 bg-gray-50 border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                {image ? 'Change Photo' : 'Upload Inspiration'}
              </button>
              {image && (
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl rotate-3">
                  <img src={image} className="w-full h-full object-cover" alt="Ref" />
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
            </div>
          </div>
        </div>

        {state.error && (
          <div className="p-8 bg-red-50 border border-red-100 rounded-[3rem] text-red-600 text-[10px] font-black uppercase text-center tracking-widest">
            {state.error}
          </div>
        )}

        <button
          onClick={handleSuggest}
          disabled={state.loading || (!interest && !image)}
          className="w-full py-7 bg-black text-white rounded-full font-bold tracking-[0.5em] uppercase disabled:bg-gray-100 transition-all shadow-2xl"
        >
          {state.loading ? 'Generating Curated Advice...' : 'Consult Stylist'}
        </button>
      </div>

      {state.result && (
        <div className="animate-fade-in pt-10 space-y-12">
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-5xl italic leading-tight">{state.result.title}</h3>
            <p className="text-gray-500 leading-relaxed text-xl italic">
              {state.result.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Top', item: state.result.outfit.top },
              { label: 'Bottom', item: state.result.outfit.bottom },
              { label: 'Shoes', item: state.result.outfit.shoes }
            ].map((pos, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:border-black transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">{pos.label}</h4>
                  <p className="font-bold text-lg mb-4 leading-tight">{pos.item.name}</p>
                </div>
                <a href={pos.item.shopUrl} target="_blank" className="inline-block text-[10px] font-black uppercase border-b-2 border-black hover:opacity-50">Redirect to Shop</a>
              </div>
            ))}
            
            <div className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Accessories</h4>
              <div className="space-y-4">
                {state.result.outfit.accessories.map((acc, i) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <p className="font-bold text-xs truncate">{acc.name}</p>
                    <a href={acc.shopUrl} target="_blank" className="text-[10px] font-bold uppercase text-gray-400 hover:text-black shrink-0">Shop</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-12 bg-black text-white rounded-[4rem] space-y-6">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">Stylist Reasoning</h4>
             <p className="text-2xl font-serif italic leading-relaxed">"{state.result.reasoning}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestView;
