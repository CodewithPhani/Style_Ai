
import React, { useState } from 'react';
import { db } from '../services/db';
import { User, UserPreferences } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (page: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(user.preferences || {
    gender: 'Unisex',
    age: '25',
    colors: ['Black'],
    budget: 'Mid-range'
  });
  const history = db.getHistory(user.id);

  const savePrefs = () => {
    db.updatePreferences(user.id, prefs);
    alert('Preferences synchronized.');
  };

  return (
    <div className="space-y-16 py-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-serif text-6xl">Bonjour, {user.name.split(' ')[0]}</h2>
          <p className="text-gray-400 mt-2">Welcome to your style command center.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onNavigate('recommend')} className="px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10 hover:-translate-y-1 transition-all">New Outift</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">Recent Consultations</h3>
            {history.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {history.slice(0, 4).map((item, i) => (
                  <div key={i} className="group glass p-4 rounded-[2rem] hover:bg-white transition-all cursor-pointer">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-[9px] font-bold uppercase tracking-widest">{item.type}</div>
                    </div>
                    <p className="text-sm font-bold truncate">{item.title || item.styleAesthetic}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2rem] text-center text-gray-300">
                <p className="text-sm">No history found. Start your journey today.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-gray-50 rounded-[2rem] space-y-8">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Personal Profile</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase text-gray-400">Gender Identity</label>
                <select 
                  className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black"
                  value={prefs.gender}
                  onChange={e => setPrefs({...prefs, gender: e.target.value})}
                >
                  <option>Masculine</option>
                  <option>Feminine</option>
                  <option>Unisex</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase text-gray-400">Budget Range</label>
                <select 
                  className="w-full bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black"
                  value={prefs.budget}
                  onChange={e => setPrefs({...prefs, budget: e.target.value})}
                >
                  <option>Budget-friendly</option>
                  <option>Mid-range</option>
                  <option>Luxury</option>
                </select>
              </div>

              <button 
                onClick={savePrefs}
                className="w-full py-4 border border-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Sync Profile
              </button>
            </div>
          </div>

          <div className="p-8 bg-black text-white rounded-[2rem] space-y-4">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Style Confidence</h4>
             <div className="flex items-baseline gap-2">
               <span className="text-5xl font-serif">84</span>
               <span className="text-xl opacity-60">/100</span>
             </div>
             <p className="text-xs opacity-60 leading-relaxed">Based on your recent uploads and choices, you're leaning heavily into Minimalist Chic.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
