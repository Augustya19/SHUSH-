import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;


let genAI: GoogleGenAI | null = null;

if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

export const getMotivationalQuote = async (): Promise<string> => {
  if (!genAI) return "Believe in yourself and all that you are.";

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, powerful, uplifting motivational quote specifically for women's health and empowerment. Do not use quotes, just the text.",
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching quote:", error);
    return "Your health is an investment, not an expense.";
  }
};

export const getArticleContent = async (prompt: string): Promise<string> => {
  if (!genAI) return "API Key not configured. Unable to fetch AI content.";

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a helpful, empathetic, and informative article (about 300 words) based on this topic: "${prompt}". Use markdown formatting with clear headings, bullet points for key takeaways, and a comforting tone.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching article:", error);
    return "AI is busy right now, please try again in a moment.";
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const getChatResponse = async (context: string, question: string, history: ChatMessage[]): Promise<string> => {
  if (!genAI) return "I can't chat right now. Please check your API key.";

  // Construct the prompt with context and history
  let promptText = `Context: You are a helpful, empathetic women's health assistant. The user is currently reading an article with the following prompt/topic: "${context}".\n\n`;

  promptText += `Chat History:\n`;
  history.forEach(msg => {
    promptText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
  });

  promptText += `\nUser's new question: ${question}\nAssistant (provide a helpful, short answer):`;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return "I'm having a little trouble thinking right now. Could you ask that again?";
  }
};
