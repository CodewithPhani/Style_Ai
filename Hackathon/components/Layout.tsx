
import React from 'react';
import { Page, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, user, onNavigate, onLogout }) => {
  const isAuth = !!user;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate(isAuth ? 'dashboard' : 'home')}
        >
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl group-hover:rotate-6 transition-transform">S</div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight leading-none">StyleSense</h1>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">AI Intelligence</span>
          </div>
        </div>
        
        <div className="flex gap-8 items-center text-xs font-bold tracking-widest uppercase">
          {isAuth ? (
            <>
              <button onClick={() => onNavigate('recommend')} className={currentPage === 'recommend' ? 'text-black' : 'text-gray-400 hover:text-black'}>Suggest</button>
              <button onClick={() => onNavigate('analyze')} className={currentPage === 'analyze' ? 'text-black' : 'text-gray-400 hover:text-black'}>Vision</button>
              <button onClick={() => onNavigate('chat')} className={currentPage === 'chat' ? 'text-black' : 'text-gray-400 hover:text-black'}>Stylist</button>
              <div className="h-4 w-[1px] bg-gray-200" />
              <div className="flex items-center gap-3">
                <span className="text-gray-500 lowercase font-normal italic">@{user.name.split(' ')[0]}</span>
                <button onClick={onLogout} className="text-red-500 hover:opacity-70">Logout</button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="hover:text-gray-500">Login</button>
              <button 
                onClick={() => onNavigate('register')}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Join
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="py-12 border-t border-gray-100 flex flex-col items-center gap-6">
        <div className="flex gap-12 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
          <span>Global Trends</span>
          <span>Sustainably Focused</span>
          <span>GenAI Powered</span>
        </div>
        <p className="text-xs text-gray-300">StyleSense © 2025 • Premium Fashion Intelligence</p>
      </footer>
    </div>
  );
};

export default Layout;
