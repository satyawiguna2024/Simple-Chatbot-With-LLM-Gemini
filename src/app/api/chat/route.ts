import "dotenv/config";
import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";

// env
const {
  OLLAMA_URL,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

const openaiProvider = new OpenAI({
  baseURL: OLLAMA_URL,
  apiKey: "ollama",
});

// connect ASTRA DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

// API CALL CHAT AI
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content || "";

    let docContext = "";

    const embedding = await openaiProvider.embeddings.create({
      model: "mxbai-embed-large",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(
        {},
        {
          sort: { $vector: embedding.data[0].embedding },
          limit: 5,
        },
      );

      const documents = await cursor.toArray();

      console.log("Documents found: ", documents.length);

      const docsMap = documents?.map((doc) => doc.text);

      docContext = docsMap.join("\n\n");
    } catch (err) {
      console.error("Error in try collection: ", err.message);
      docContext = "";
    }

    const template = {
      role: "system",
      content: `
      You are a chatbot that ONLY answers questions about Indonesian history articles.

      Rules:
      - Answer only from provided context.
      - If question is unrelated to Indonesian history article, say:
        "Saya hanya bisa menjawab pertanyaan terkait artikel sejarah Indonesia ini."
      - If answer is not found in context, say:
        "Saya tidak menemukan informasi tersebut."
      - Use Indonesian language.
      - Keep answers short and clear.

      CONTEXT:
      ${docContext}
      `,
    };

    const response = await openaiProvider.chat.completions.create({
      model: "qwen2.5:1.5b",
      stream: true,
      messages: [template, ...messages],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (streamErr) {
          console.error("Error in stream response: ", streamErr);
          controller.error(streamErr);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Error in POST chat: ", err.message);
    throw err;
  }
}
