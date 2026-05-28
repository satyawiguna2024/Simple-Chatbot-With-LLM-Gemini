/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";

const { GEMINI_API_KEY, ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN } = process.env;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Db Astra
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage: string = messages?.[messages.length - 1]?.content ?? "";

    let docContext = "";

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: latestMessage,
    });

    const vectorQuery = embeddingResponse.embeddings[0].values;

    try {
      const collection = db.collection(ASTRA_DB_COLLECTION!);
      const cursor = collection.find({}, {
        sort: { $vector: vectorQuery },
        limit: 10,
      });

      const documents = await cursor.toArray();
      console.log("Documents found:", documents.length);

      docContext = documents.map((doc) => doc.text).join("\n\n");
    } catch (err: any) {
      console.error("Error fetching from Astra DB:", err.message);
      docContext = "";
    }

    const systemInstruction = `
      You are an expert AI assistant specializing in Indonesian history, culture, government, geography, and society.

      Your task:
      - Answer in clear, accurate Indonesian.
      - Use the provided context as the primary source.
      - Be direct: answer the user's question first in 1–2 sentences, then add only essential detail.
      - Keep the entire reply under 250 words. Do not pad, repeat, or add tangential background.
      - Prefer short paragraphs; use bullet points only when listing 3+ distinct items.
      - If context is insufficient, use general knowledge sparingly and stay within the word limit.
      - Never hallucinate fake facts.

      If the answer does not exist in the context, reply only with: "Saya tidak menemukan informasi tersebut."

      CONTEXT:
      --------------------
      START CONTEXT
      ${docContext}
      END CONTEXT
      --------------------
    `;

    // pastikan hanya role "user" atau "model" yang masuk (bukan "system")
    const formattedContents = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    return Response.json({
      role: "assistant",
      content: response.text,
    });

  } catch (err: any) {
    console.error("Error in POST /chat:", err.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}