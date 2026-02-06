
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SuggestView from './components/SuggestView';
import Analyze from './components/Analyze';
import Chat from './components/Chat';
import { db } from './services/db';
import { Page, User } from './types';

// Define the global AIStudio interface to ensure compatibility with existing environment types
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fixed: Made optional to match existing ambient definitions and avoid modifier mismatch error
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true); // Default to true, check on mount

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();

    const savedUser = db.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume selection was successful as per guidelines
      setHasApiKey(true);
    }
  };

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    db.setCurrentUser(u);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    db.setCurrentUser(null);
    setCurrentPage('home');
  };

  // If no key is selected, block access with a clear message (mandated for apps using specific AI models)
  if (!hasApiKey && currentPage !== 'home') {
    return (
      <Layout currentPage={currentPage} user={user} onNavigate={setCurrentPage} onLogout={handleLogout}>
        <div className="max-w-md mx-auto py-24 text-center space-y-8 animate-fade-in">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto border border-gray-100">
             <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-4xl italic">Authenticate Stylist Engine</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              To use AI image generation and analysis, you must connect a valid Gemini API key from a paid GCP project.
            </p>
          </div>
          <button 
            onClick={handleSelectKey}
            className="w-full py-5 bg-black text-white font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-all"
          >
            Connect API Key
          </button>
          <p className="text-[10px] text-gray-300 uppercase tracking-widest">
            Need help? View the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-black">Billing Documentation</a>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      currentPage={currentPage} 
      user={user} 
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {currentPage === 'home' && (
        <div className="py-20 text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-[0.5em] text-gray-400 uppercase block">Artificial intelligence for the Modern Wardrobe</span>
            <h1 className="font-serif text-7xl md:text-9xl leading-none tracking-tighter">Your AI <br /><span className="italic">Stylist.</span></h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              StyleSense combines computer vision and generative intelligence to curate your personal aesthetic. Discover outfits, analyze your look, and talk to an expert 24/7.
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <button onClick={() => setCurrentPage('register')} className="px-12 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Get Started</button>
            <button onClick={() => setCurrentPage('login')} className="px-12 py-5 border border-gray-100 rounded-full font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">Member Login</button>
          </div>
        </div>
      )}

      {(currentPage === 'login' || currentPage === 'register') && (
        <Auth mode={currentPage as any} onSuccess={handleLoginSuccess} onSwitchMode={setCurrentPage} />
      )}

      {user && (
        <>
          {currentPage === 'dashboard' && <Dashboard user={user} onNavigate={setCurrentPage} />}
          {currentPage === 'recommend' && <SuggestView user={user} />}
          {currentPage === 'analyze' && <Analyze user={user} />}
          {currentPage === 'chat' && <Chat user={user} />}
        </>
      )}
    </Layout>
  );
};

export default App;
