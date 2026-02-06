
export type Page = 'home' | 'login' | 'register' | 'dashboard' | 'analyze' | 'recommend' | 'chat' | 'history';

export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  gender: string;
  age: string;
  colors: string[];
  budget: string;
  skinTone?: string;
}

export interface RecommendationRequest {
  occasion: string;
  weather: string;
  location: string;
  styleVibe: string;
}

export interface OutfitItem {
  name: string;
  shopUrl: string;
}

export interface RecommendationResponse {
  title: string;
  description: string;
  outfit: {
    top: OutfitItem;
    bottom: OutfitItem;
    shoes: OutfitItem;
    accessories: OutfitItem[];
  };
  styleScore: number;
  reasoning: string;
  visualPrompt: string;
}

export interface SuggestedOutfit {
  occasion: string;
  items: Array<{ name: string; color: string; shopUrl: string }>;
}

export interface AnalysisResponse {
  detectedItems: Array<{ type: string; color: string; pattern: string }>;
  styleAesthetic: string;
  suggestions: Array<{ text: string; shopUrl: string }>;
  suitableOutfits: SuggestedOutfit[];
  skintoneAnalysis: string;
  styleConfidence: number;
  palette: string[];
  feedback: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
  visualUrl?: string;
}

export interface GenerationState<T = any> {
  loading: boolean;
  error: string | null;
  result: T | null;
  visualUrl?: string | null;
  visualizing?: boolean;
}
