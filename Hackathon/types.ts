
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

export interface WardrobeCategory {
  category: 'Shirt' | 'T-Shirt' | 'Pants' | 'Joggers' | 'Chinos' | 'Bootcut' | 'Jeans';
  recommendation: string;
  shopUrl: string;
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
  evolvedLookDescription: string;
  addons: Array<{ name: string; reason: string; shopUrl: string }>;
  grooming: {
    hairstyle: string;
    beardStyle: string;
    saloonAdvice: string;
  };
  skincare: {
    advice: string;
    routine: string[];
    products: Array<{ name: string; brand: string; shopUrl: string }>;
  };
  wardrobe: WardrobeCategory[];
  sneakers: Array<{
    model: string;
    colorway: string;
    reason: string;
    shopUrl: string;
  }>;
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
