
import { GoogleGenAI, Type } from "@google/genai";
import type { FileNode, TechOptions } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileNodeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The name of the file or folder." },
    type: { type: Type.STRING, enum: ['file', 'folder'], description: "The type of the node." },
    content: { type: Type.STRING, nullable: true, description: "The content of the file, if it's a file." },
    children: {
      type: Type.ARRAY,
      nullable: true,
      items: {} // Self-referencing placeholder
    }
  },
  required: ['name', 'type']
};
// @ts-ignore
fileNodeSchema.properties.children.items = fileNodeSchema;

const schema = {
  type: Type.OBJECT,
  properties: {
    root: fileNodeSchema
  },
  required: ['root']
};


export const generateProjectStructure = async (
  description: string,
  options: TechOptions,
  imageDataUrl: string | null
): Promise<FileNode> => {
  const model = "gemini-2.5-pro";

  const prompt = `
    You are an expert full-stack software architect. 
    Your task is to generate a complete, well-structured file and folder layout for a new web application based on the user's specifications.
    If an image is provided, use it as a strong visual and functional reference for the application's UI, features, and data structure. For example, if given an image of a receipt, generate an expense tracking app. If given a UI mockup, generate the code to implement that design.
    You must provide sensible, working, and modern boilerplate code for key files.
    The output must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanations or markdown formatting outside of the JSON.

    Application Specifications:
    - Project Description: ${description}
    - Frontend Technology: ${options.frontend}
    - Backend Technology: ${options.backend}
    - Database: ${options.database}

    Instructions:
    1.  Create a root folder named after the project (e.g., 'todo-app', 'expense-tracker').
    2.  Inside the root, create 'frontend' and 'backend' subdirectories.
    3.  Populate the 'frontend' directory with a standard project structure for ${options.frontend}, including components that reflect the visual reference if provided.
    4.  Populate the 'backend' directory with a standard project structure for ${options.backend}, including API endpoints and database models that support the application's features.
    5.  Include essential configuration files like 'package.json', 'Dockerfile', '.env.example', and 'README.md' at appropriate levels.
    6.  The generated code should be practical boilerplate that a developer can immediately start working with.
  `;
  
  const contents: any = { parts: [{ text: prompt }] };

  if (imageDataUrl) {
    const mimeType = imageDataUrl.match(/data:(.*);base64,/)?.[1];
    if (!mimeType) {
      throw new Error("Invalid image data URL: Could not determine MIME type.");
    }
    const base64Data = imageDataUrl.split(',')[1];
    contents.parts.push({
      inlineData: {
        mimeType,
        data: base64Data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    
    if (parsedJson && parsedJson.root) {
        return parsedJson.root as FileNode;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to generate project structure. The model returned a malformed JSON response.");
    }
    throw new Error("Failed to generate project structure. The model may have returned an invalid response.");
  }
};