import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: "halo",
      config: {
        systemInstruction: "You are Veriq.",
        responseMimeType: "application/json",
        responseSchema: {
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
                description: "Clear and intelligent explanation of the analysis."
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
              recommendations: {
                type: Type.ARRAY,
                description: "Actionable safety recommendations.",
                items: {
                  type: Type.STRING
                }
              }
            },
            required: ["riskLevel", "probabilityPercentage", "explanation", "suspiciousHighlights", "manipulationBreakdown", "recommendations"]
          }
      }
    });
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
main();
