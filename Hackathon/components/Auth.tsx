
import React, { useState } from 'react';
import { db } from '../services/db';
import { Page, User } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  onSuccess: (user: User) => void;
  onSwitchMode: (mode: Page) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Masculine');
  const [skinTone, setSkinTone] = useState('Light');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      const users = db.getUsers();
      if (users.find(u => u.email === email)) {
        setError('Email already exists');
        return;
      }
      const newUser: User & { password?: string } = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password,
        preferences: {
          gender,
          skinTone,
          age: '25',
          colors: ['Black'],
          budget: 'Mid-range'
        }
      };
      db.saveUser(newUser);
      onSuccess(newUser);
    } else {
      const users = db.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="text-center mb-10 space-y-4">
        <h2 className="font-serif text-5xl">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-gray-500">The future of your wardrobe starts here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'register' && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-black outline-none transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gender</label>
                <select 
                  className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-black outline-none bg-transparent appearance-none cursor-pointer"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="Masculine">Masculine</option>
                  <option value="Feminine">Feminine</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Skin Tone</label>
                <select 
                  className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-black outline-none bg-transparent appearance-none cursor-pointer"
                  value={skinTone}
                  onChange={e => setSkinTone(e.target.value)}
                >
                  <option value="Light">Light</option>
                  <option value="Tan">Tan</option>
                  <option value="Medium">Medium</option>
                  <option value="Dark">Dark</option>
                  <option value="Deep">Deep</option>
                </select>
              </div>
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            required
            type="email" 
            className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-black outline-none transition-colors"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
          <input 
            required
            type="password" 
            className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-black outline-none transition-colors"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

        <button className="w-full py-4 bg-black text-white font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <button onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')} className="text-gray-400 hover:text-black">
          {mode === 'login' ? "Don't have an account? Join" : "Already a member? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
