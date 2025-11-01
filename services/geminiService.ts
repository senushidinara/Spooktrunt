import { GoogleGenAI, Type } from "@google/genai";
import type { ArchitecturalStructure, FeasibilityReport } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const structureSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the structure, can be a timestamp." },
    name: { type: Type.STRING, description: "A creative, evocative name for the structure." },
    description: { type: Type.STRING, description: "A detailed, imaginative description of the structure, as if describing a piece of art." },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 primary, potentially surreal or futuristic materials used."
    },
    style: { type: Type.STRING, description: "The primary architectural style (e.g., Gothic-Futurism, Bioluminescent-Brutalism, Aether-Deco)." },
    dimensions: {
        type: Type.OBJECT,
        properties: {
            height: { type: Type.STRING, description: "Estimated height of the structure (e.g., '300 meters')." },
            width: { type: Type.STRING, description: "Estimated width or footprint of the structure (e.g., '150 meters')." },
            floors: { type: Type.INTEGER, description: "Number of floors or levels." }
        },
        required: ['height', 'width', 'floors']
    },
    structuralIntegrityScore: { type: Type.NUMBER, description: "A score from 1-100 indicating hypothetical structural soundness." },
    environmentalImpact: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Unknown'], description: "An assessment of the environmental footprint ('Low', 'Moderate', 'High', 'Unknown')." }
  },
  required: ['id', 'name', 'description', 'materials', 'style', 'dimensions', 'structuralIntegrityScore', 'environmentalImpact']
};

const feasibilitySchema = {
    type: Type.OBJECT,
    properties: {
        stability: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.NUMBER, description: "A rating from 1 to 10 on structural stability." },
                analysis: { type: Type.STRING, description: "A brief analysis of the stability challenges and strengths." }
            },
            required: ['rating', 'analysis']
        },
        energyEfficiency: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.NUMBER, description: "A rating from 1 to 10 on energy efficiency." },
                analysis: { type: Type.STRING, description: "A brief analysis of its energy consumption and generation." }
            },
            required: ['rating', 'analysis']
        },
        materialSuitability: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.NUMBER, description: "A rating from 1 to 10 on the suitability of materials." },
                analysis: { type: Type.STRING, description: "A brief analysis of why the materials are or aren't suitable." }
            },
            required: ['rating', 'analysis']
        },
        costEstimation: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.NUMBER, description: "A rating from 1 to 10 on cost (1=cheap, 10=exorbitant)." },
                analysis: { type: Type.STRING, description: "A brief analysis of the cost factors." }
            },
             required: ['rating', 'analysis']
        },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 actionable suggestions to improve feasibility."
        }
    },
    required: ['stability', 'energyEfficiency', 'materialSuitability', 'costEstimation', 'suggestions']
};

export async function generateStructure(prompt: string): Promise<{ structureData: ArchitecturalStructure, imageGenPrompt: string }> {
  const uniqueId = `gen_${Date.now()}`;
  const fullPrompt = `You are Spooktrunt, an AI architectural engine that designs surreal and haunted structures.
  Based on the user's prompt, generate the JSON data for a unique architectural creation.
  IMPORTANT: The 'id' field MUST be set to "${uniqueId}".
  User prompt: "${prompt}"
  Also, create a separate, highly detailed and dramatic text-to-image prompt to visualize this structure. The image prompt should be photorealistic, cinematic, and capture the eerie, epic, and impossible nature of the design.

  Return a single JSON object with two keys: "structure" (containing the structured data) and "imagePrompt" (containing the text for image generation).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: fullPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
          type: Type.OBJECT,
          properties: {
              structure: structureSchema,
              imagePrompt: { type: Type.STRING }
          },
          required: ['structure', 'imagePrompt']
      }
    }
  });

  const jsonResponse = JSON.parse(response.text);
  return { structureData: jsonResponse.structure, imageGenPrompt: jsonResponse.imagePrompt };
}


export async function reviveBlueprint(prompt: string, imagePart: { inlineData: { data: string; mimeType: string; } }): Promise<{ structureData: ArchitecturalStructure, imageGenPrompt: string }> {
  const uniqueId = `rev_${Date.now()}`;
  const fullPrompt = `You are Spooktrunt, an AI architectural engine that revives and modernizes blueprints.
  Analyze the provided image of a structure. Based on the user's prompt, reimagine it and generate the JSON data for the modernized creation.
  IMPORTANT: The 'id' field for the new structure MUST be set to "${uniqueId}".
  User prompt: "${prompt}"
  Also, create a separate, highly detailed and dramatic text-to-image prompt to visualize this new, revived structure. The image prompt should be photorealistic, cinematic, and reflect the user's revival request.

  Return a single JSON object with two keys: "structure" (containing the structured data for the NEW design) and "imagePrompt" (containing the text for image generation).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: {
        parts: [
            { text: fullPrompt },
            imagePart
        ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
          type: Type.OBJECT,
          properties: {
              structure: structureSchema,
              imagePrompt: { type: Type.STRING }
          },
          required: ['structure', 'imagePrompt']
      }
    }
  });

  const jsonResponse = JSON.parse(response.text);
  return { structureData: jsonResponse.structure, imageGenPrompt: jsonResponse.imagePrompt };
}

export async function analyzeStructureFeasibility(structure: ArchitecturalStructure, imageData: string): Promise<FeasibilityReport> {
  const prompt = `You are a pragmatic, world-weary structural engineer and futurist architect rolled into one.
  Analyze the provided architectural data and its accompanying image to create a feasibility report. Be critical but fair.
  Structure Data: ${JSON.stringify(structure, null, 2)}
  
  Based on the structure's data and the visual information from the image, generate a feasibility report in JSON format.
  Focus on stability, energy efficiency, material suitability, and cost. Provide actionable suggestions.
  `;

  const imagePart = {
    inlineData: {
      data: imageData,
      mimeType: 'image/jpeg'
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [{ text: prompt }, imagePart] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: feasibilitySchema
    }
  });
  
  const jsonResponse = JSON.parse(response.text);
  return jsonResponse as FeasibilityReport;
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  }
  throw new Error("Image generation failed to return any images.");
}
