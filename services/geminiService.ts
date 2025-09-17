import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AdCopy } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("The API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper function to convert a File object to a base64 string
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Handle ArrayBuffer case if necessary, though for images this is less common
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function editImageWithNanoBanana(imageFile: File, textPrompt: string): Promise<string | null> {
  const imagePart = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        imagePart,
        { text: textPrompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Extract the generated image from the response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const mimeType = part.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
  }

  return null; // Return null if no image was found
}

export async function generateAdCopy(brandName: string, toneAndManner: string): Promise<AdCopy[]> {
  if (!brandName.trim() && !toneAndManner.trim()) {
    return []; // Return empty array if no info is provided
  }

  let prompt = `당신은 전문 카피라이터입니다. 소셜 미디어 게시물을 위한 짧고 시선을 사로잡는 광고 카피 3가지를 작성해주세요.`;
  
  const details = [];
  if (brandName.trim()) {
    details.push(`브랜드는 "${brandName.trim()}"`);
  }
  if (toneAndManner.trim()) {
    details.push(`톤앤매너는 "${toneAndManner.trim()}"`);
  }
  
  if (details.length > 0) {
    prompt += ` ${details.join('이고, ')}입니다.`;
  }
  
  prompt += ` 이미지를 기반으로 한 광고에 적합해야 합니다.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          copies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                copy: {
                  type: Type.STRING,
                  description: "A single ad copy suggestion."
                }
              },
              required: ["copy"]
            }
          }
        },
        required: ["copies"]
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.copies || [];
  } catch (e) {
    console.error("Failed to parse ad copy JSON:", e);
    // Fallback if JSON is malformed
    return [{ copy: "광고 카피 생성에 실패했습니다. 다시 시도해주세요." }];
  }
}