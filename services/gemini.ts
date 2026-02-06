
import { GoogleGenAI, Type } from "@google/genai";
import { User, RecommendationRequest, RecommendationResponse, AnalysisResponse } from "../types";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const extractMimeType = (base64String: string): string => {
  if (base64String.startsWith('data:')) {
    const match = base64String.match(/^data:(image\/\w+);base64,/);
    if (match) return match[1];
  }
  return 'image/jpeg';
};

const extractAndCleanJson = (text: string) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("Format Error: No data structure found.");
    let cleaned = text.substring(start, end + 1);
    cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1'); 
    cleaned = cleaned.replace(/\\'/g, "'");
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Clean Error:", e);
    throw new Error("Stylist provided a malformed response. Please try again.");
  }
};

const ANALYSIS_PROMPT = (user: User) => `
  Analyze this user's photo. Act as a Luxury Image Architect (Stylist + Master Barber + Dermatologist).
  User Info: ${user.preferences?.gender}, ${user.preferences?.skinTone} skin tone.
  
  TASK: Provide a total image upgrade blueprint. Focus strictly on technical text advice.
  
  JSON SCHEMA: {
    "detectedItems": [{"type": "string", "color": "string", "pattern": "string"}],
    "styleAesthetic": "string",
    "suggestions": [{"text": "string", "shopUrl": "string"}],
    "skintoneAnalysis": "Technical analysis of skin-outfit color theory.",
    "palette": ["#hexcode"],
    "feedback": "Technical style feedback.",
    "evolvedLookDescription": "A 3-paragraph vivid text visualization of their UPGRADED look. Describe fabric textures, fit, and atmosphere.",
    "addons": [{"name": "string", "reason": "string", "shopUrl": "string"}],
    "grooming": {
      "hairstyle": "Technical haircut name",
      "beardStyle": "Facial hair trimming instructions",
      "saloonAdvice": "Words to say to the barber."
    },
    "skincare": {
      "advice": "Skin-tone specific care for ${user.preferences?.skinTone} skin.",
      "routine": ["Step 1", "Step 2", "Step 3"],
      "products": [
        {"name": "Specific Product Name", "brand": "Brand Name", "shopUrl": "Google Shopping Link"}
      ]
    },
    "wardrobe": [
      {"category": "Shirt", "recommendation": "string", "shopUrl": "string"},
      {"category": "T-Shirt", "recommendation": "string", "shopUrl": "string"},
      {"category": "Pants", "recommendation": "string", "shopUrl": "string"},
      {"category": "Joggers", "recommendation": "string", "shopUrl": "string"},
      {"category": "Chinos", "recommendation": "string", "shopUrl": "string"},
      {"category": "Bootcut", "recommendation": "string", "shopUrl": "string"},
      {"category": "Jeans", "recommendation": "string", "shopUrl": "string"}
    ],
    "sneakers": [{"model": "string", "colorway": "string", "reason": "string", "shopUrl": "string"}],
    "styleConfidence": 85
  }
`;

export const analyzeLook = async (
  base64Image: string, 
  user: User, 
  model: string = 'gemini-3-flash-preview',
  retryCount: number = 0
): Promise<AnalysisResponse> => {
  const ai = getAI();
  const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data, mimeType: extractMimeType(base64Image) } },
          { text: ANALYSIS_PROMPT(user) }
        ]
      }
    });
    return extractAndCleanJson(response.text || "{}");
  } catch (err: any) { 
    const errorMsg = err.message || "";
    
    // Handle "Overloaded" (503) or "Rate Limit" (429)
    const isServerBusy = errorMsg.includes('503') || errorMsg.includes('overloaded') || errorMsg.includes('UNAVAILABLE');
    const isRateLimited = errorMsg.includes('429') || errorMsg.includes('quota');

    if ((isServerBusy || isRateLimited) && retryCount < 2) {
      console.warn(`Model ${model} busy. Attempting fallback... (Retry ${retryCount + 1})`);
      
      // Wait a moment before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try with Flash Lite which is more stable under load
      return analyzeLook(base64Image, user, 'gemini-flash-lite-latest', retryCount + 1);
    }
    
    throw err; 
  }
};

export const getStylingAdvice = async (user: User, request: RecommendationRequest, base64Image?: string): Promise<RecommendationResponse> => {
  const ai = getAI();
  const prompt = `Act as a High-End Fashion Stylist. User Profile: ${user.preferences?.gender}, Skin Tone: ${user.preferences?.skinTone}. Occasion: ${request.occasion}. Aesthetic: ${request.styleVibe}. Generate a complete outfit in valid JSON. No images.`;
  const parts: any[] = [{ text: prompt }];
  if (base64Image) {
    const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    parts.push({ inlineData: { data, mimeType: extractMimeType(base64Image) } });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    return extractAndCleanJson(response.text || "{}");
  } catch (err: any) { throw err; }
};
