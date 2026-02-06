
import React, { useState } from 'react';
import { getStylingAdvice } from '../services/gemini';
import { db } from '../services/db';
import { User, RecommendationResponse } from '../types';

const Recommend: React.FC<{ user: User }> = ({ user }) => {
  const [occasion, setOccasion] = useState('Casual');
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const rec = await getStylingAdvice(user, {
        occasion,
        weather: 'Perfectly Seasonal',
        location: 'Current Location',
        styleVibe: vibe
      });
      setResult(rec);
      db.saveToHistory(user.id, { type: 'recommendation', ...rec });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ShopBadge: React.FC<{ item: { name: string; shopUrl: string } }> = ({ item }) => (
    <div className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-black transition-all">
      <div className="flex-1">
        <p className="text-sm font-bold truncate pr-4">{item.name}</p>
        <a 
          href={item.shopUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black flex items-center gap-1 mt-1 transition-colors"
        >
          Redirect to product
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-16">
      <div className="text-center">
        <h2 className="font-serif text-6xl italic mb-6">Style Architect</h2>
        <p className="text-gray-400 text-lg uppercase tracking-widest text-[10px] font-bold">Text-Based Aesthetic Engineering</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-10 sticky top-28 bg-gray-50 p-10 rounded-[3rem]">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Context</label>
            <div className="flex flex-wrap gap-2">
              {['Casual', 'Business', 'Night Out', 'Wedding', 'Gym'].map(o => (
                <button 
                  key={o} 
                  onClick={() => setOccasion(o)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all border ${occasion === o ? 'bg-black text-white border-black' : 'bg-white border-gray-100 hover:border-black'}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Inspiration Keywords</label>
            <input 
              type="text" 
              placeholder="e.g. Minimalist, Bootcut, Linen..."
              className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-black outline-none transition-all text-sm font-bold"
              value={vibe}
              onChange={e => setVibe(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-5 bg-black text-white font-bold tracking-[0.3em] uppercase rounded-full hover:scale-105 transition-all shadow-xl"
          >
            {loading ? 'Consulting stylists...' : 'Generate Blueprint'}
          </button>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-4">
                <h3 className="font-serif text-5xl italic font-bold">{result.title}</h3>
                <p className="text-gray-500 leading-relaxed italic text-lg border-l-4 border-black pl-8">"{result.reasoning}"</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                 <ShopBadge item={result.outfit.top} />
                 <ShopBadge item={result.outfit.bottom} />
                 <ShopBadge item={result.outfit.shoes} />
                 {result.outfit.accessories.map((acc, i) => (
                   <ShopBadge key={i} item={acc} />
                 ))}
              </div>

              <div className="p-10 bg-gray-50 rounded-[3rem] space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stylist's Aesthetic Notes</h4>
                <p className="text-sm text-gray-600 leading-loose">{result.description}</p>
              </div>
            </div>
          ) : (
            <div className="h-[500px] border-2 border-dashed border-gray-100 rounded-[4rem] flex flex-col items-center justify-center text-gray-200">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Awaiting Style Logic</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommend;
