import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function genai(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt
  });

  return response.text
}


export async function genAIstructuredOutput(prompt) {
  const response = await genai(prompt)

  const json = response.replace('```json', "").replace('```', '')

  return JSON.parse(json)
}

export async function genAIDocUnderstand(link, question) {

  const pdfResp = await fetch(link)
    .then((response) => response.arrayBuffer());

  const contents = [
    { text: question },
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: Buffer.from(pdfResp).toString("base64")
      }
    }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents
  });

  return response.text
}
