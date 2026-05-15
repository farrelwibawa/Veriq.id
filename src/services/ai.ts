import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  probabilityPercentage: number;
  explanation: string;
  domainAnalysis?: {
    isPresent: boolean;
    suspiciousDomain?: string;
    legitimateDomain?: string;
    suspiciousParts?: string[];
    explanation?: string;
  };
  suspiciousHighlights: {
    phrase: string;
    reason: string;
  }[];
  manipulationBreakdown: {
    pattern: string;
    description: string;
  }[];
  educationalInsights?: {
    title: string;
    description: string;
  }[];
  recommendations: string[];
  suggestedQuestions?: string[];
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      description: "The risk level of the text. Must be LOW, MEDIUM, or HIGH.",
      enum: ["LOW", "MEDIUM", "HIGH"]
    },
    probabilityPercentage: {
      type: Type.NUMBER,
      description: "The probability of the text being a scam or malicious (0-100)."
    },
    explanation: {
      type: Type.STRING,
      description: "Very brief, sharp, 1-2 sentence intelligence summary of the threat. Focus on the core mechanism. No long paragraphs."
    },
    domainAnalysis: {
      type: Type.OBJECT,
      description: "Analysis of any suspicious domains found in the text. Only populate if a domain manipulation is detected.",
      properties: {
        isPresent: { type: Type.BOOLEAN },
        suspiciousDomain: { type: Type.STRING },
        legitimateDomain: { type: Type.STRING },
        suspiciousParts: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        explanation: { type: Type.STRING }
      },
      required: ["isPresent"]
    },
    suspiciousHighlights: {
      type: Type.ARRAY,
      description: "List of highly suspicious phrases found in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: {
            type: Type.STRING,
            description: "The exact suspicious phrase from the text."
          },
          reason: {
            type: Type.STRING,
            description: "Why this phrase is suspicious (e.g., 'Creates fake urgency')."
          }
        },
        required: ["phrase", "reason"]
      }
    },
    manipulationBreakdown: {
      type: Type.ARRAY,
      description: "Psychological manipulation patterns detected in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          pattern: {
            type: Type.STRING,
            description: "Type of manipulation (e.g. Fear Trigger, Urgency Pressure, Fake Authority, Emotional Manipulation, Forced Action Pattern)"
          },
          description: {
            type: Type.STRING,
            description: "Short explanation of how this pattern is used in the text."
          }
        },
        required: ["pattern", "description"]
      }
    },
    educationalInsights: {
      type: Type.ARRAY,
      description: "Psychological explanation of why humans emotionally fall for this specific manipulation. Focus on emotional triggers, urgency, fear/panic, and impulsive reactions. Provide 2 concise insights.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Short, engaging title (e.g., 'Mengapa Scam Ini Terdengar Meyakinkan?', 'Taktik Urgensi & Kepanikan')"
          },
          description: {
            type: Type.STRING,
            description: "Psychological explanation explaining why this scam feels convincing, what emotional trigger is used, or why victims may react impulsively."
          }
        },
        required: ["title", "description"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      description: "Actionable safety recommendations.",
      items: {
        type: Type.STRING
      }
    },
    suggestedQuestions: {
      type: Type.ARRAY,
      description: "2 predictive follow-up questions that the user might want to ask Vera (the AI chat bot) based on the context of the scanned content.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["riskLevel", "probabilityPercentage", "explanation", "recommendations"]
};

function parseResult(jsonStr: string): AnalysisResult {
  let cleaned = jsonStr.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\n/, "").replace(/\n```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\n/, "").replace(/\n```$/, "");
  }
  
  try {
    const defaultRes = {
      suspiciousHighlights: [],
      manipulationBreakdown: [],
      educationalInsights: [],
      recommendations: [],
      suggestedQuestions: [],
    };
    const parsed = JSON.parse(cleaned) as AnalysisResult;
    return { ...defaultRes, ...parsed };
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    console.error("Raw response output:", jsonStr);
    throw new Error("Invalid AI response format");
  }
}

export async function analyzeText(text: string, language: 'id' | 'en'): Promise<AnalysisResult> {
  const systemInstruction = 
    language === 'id' 
      ? 'Kamu adalah Veriq.id, AI penganalisis ancaman digital futuristik. Analisis teks berikut untuk mendeteksi penipuan, phishing, atau manipulasi (sosial engineering). Gunakan bahasa Indonesia modern dan natural. Berikan skor risiko, Penjelasan logis super singkat (maks 2 kalimat tajam), kutipan frasa mencurigakan, breakdown pola manipulasi (singkat), rekomendasi (maks 3 poin pendek), dan suggestedQuestions (2 pertanyaan pendek). Berikan juga educationalInsights berupa 2 insight psikologis super singkat (maks 2 kalimat per insight). Jelaskan secara pintar dan langsung ke intinya. Hindari paragraf panjang. Jika aman, berikan pesan aman singkat.'
      : 'You are Veriq.id, a futuristic AI digital threat analyzer. Analyze the following text to detect scams, phishing, or manipulation. Use modern and natural English. Provide a risk score, an ultra-concise logical explanation (max 2 sharp sentences), quotes of suspicious phrases, brief manipulation breakdown patterns, short recommendations (max 3 points), and suggestedQuestions (2 short questions). Provide educationalInsights as 2 ultra-concise psychological insights (max 2 sentences each). Be smart and get straight to the point. Avoid long paragraphs. If completely safe, give short basic safety insight.';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });
    
    return parseResult(response.text?.trim() || "");
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    if (error?.status === 429 || error?.message?.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

export async function analyzeImage(fileBase64: string, mimeType: string, language: 'id' | 'en'): Promise<AnalysisResult> {
  const systemInstruction = 
    language === 'id' 
      ? 'Kamu adalah Veriq.id, AI penganalisis ancaman digital futuristik. Ekstrak dan baca teks dalam gambar. Analisis visual dan teks untuk mendeteksi manipulasi (sosial engineering). Gunakan bahasa Indonesia modern. Berikan skor risiko, Penjelasan logis super singkat (maks 2 kalimat tajam), kutipan frasa mencurigakan, breakdown pola manipulasi (singkat), rekomendasi (maks 3 poin pendek), dan suggestedQuestions (2 pertanyaan pendek). Berikan juga educationalInsights berupa 2 insight psikologis super singkat (maks 2 kalimat per insight). Jelaskan secara pintar dan langsung ke intinya. Hindari paragraf panjang. Jika aman, berikan pesan aman singkat.'
      : 'You are Veriq.id, a futuristic AI digital threat analyzer. Extract and read text from the image. Analyze text/visuals to detect scams/manipulation. Use modern English. Provide a risk score, an ultra-concise logical explanation (max 2 sharp sentences), quotes of suspicious phrases, brief manipulation breakdown patterns, short recommendations (max 3 points), and suggestedQuestions (2 short questions). Provide educationalInsights as 2 ultra-concise psychological insights (max 2 sentences each). Be smart and get straight to the point. Avoid long paragraphs. If completely safe, give short basic safety insight.';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        { inlineData: { data: fileBase64, mimeType } },
        { text: "Analyze this image for potential scams, manipulation, and phishing patterns." }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });
    
    return parseResult(response.text?.trim() || "");
  } catch (error: any) {
    console.error("Gemini Image API call failed:", error);
    if (error?.status === 429 || error?.message?.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

export async function askVera(
  question: string,
  contextText: string,
  scanResult: AnalysisResult,
  language: 'id' | 'en'
): Promise<string> {
  const systemInstruction = 
    language === 'id'
      ? 'Kamu adalah Vera, mentor intelijen siber dan pemandu keamanan digital yang empati. Berikan HANYA 1 paragraf singkat, padat, dan berbobot tanpa basa-basi berlebih. Jangan pernah terdengar seperti robot, customer support generik atau ChatGPT. Jawab dengan bahasa Indonesia modern yang natural, tenang, dan mendalam (insightful). Percakapan harus HANYA terfokus pada menjelaskan pola scam, manipulasi psikologis, motif penipuan, dan panduan keamanan digital.'
      : 'You are Vera, an empathetic cyber intelligence mentor and digital safety guide. Provide ONLY 1 short, concise, and insightful paragraph without unnecessary fluff. Never sound like a robot, generic customer support, or ChatGPT. Use natural, calm, and insightful modern English. The conversation must stay ONLY focused on explaining scam patterns, psychological manipulation, fraud motives, and digital safety guidance.';

  const contextPrompt = 
    language === 'id'
      ? `=== KONTEKS SAAT INI ===\nPesan: "${contextText.substring(0, 500)}..."\nHasil Veriq.id: Risiko ${scanResult.riskLevel}, ${scanResult.probabilityPercentage}%.\nPola: ${scanResult.manipulationBreakdown.map(m => m.pattern).join(", ")}\n\nPertanyaan pengguna: ${question}\n\nJawablah HANYA dengan 1 paragraf singkat (maksimal 3-4 kalimat). Langsung ke intinya, empati, edukatif, dan jangan bertele-tele.`
      : `=== CURRENT CONTEXT ===\nMessage: "${contextText.substring(0, 500)}..."\nVeriq.id Result: Risk ${scanResult.riskLevel}, ${scanResult.probabilityPercentage}%.\nPatterns: ${scanResult.manipulationBreakdown.map(m => m.pattern).join(", ")}\n\nUser question: ${question}\n\nAnswer ONLY with 1 short paragraph (max 3-4 sentences). Get straight to the point, be empathetic, educational, and concise.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: contextPrompt,
      config: {
        systemInstruction,
      }
    });
    return response.text?.trim() || "Maaf, Vera sedang mengalami gangguan koneksi. Silakan coba sebentar lagi.";
  } catch (error: any) {
    console.error("Gemini Vera API call failed:", error);
    if (error?.status === 429 || error?.message?.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}
