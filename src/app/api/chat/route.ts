import "dotenv/config";
import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";

// env
const { OLLAMA_URL, ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN } = process.env;

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
      encoding_format: "float"
    });

    try {
      const collection = db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find({}, {
        sort: { $vector: embedding.data[0].embedding },
        limit: 10,
      });

      const documents = await cursor.toArray();
      
      console.log("Documents found: ", documents.length);

      const docsMap = documents?.map(doc => doc.text);

      docContext = docsMap.join("\n\n");
    } catch (err) {
      console.error("Error in try collection: ", err.message);
      docContext = "";
    }

    const template = {
      role: "system",
      content: `
      You are an expert AI assistant specializing in Indonesian history, culture, government, geography, and society.

      Your task:
      - Answer in detailed, comprehensive, and accurate Indonesian language.
      - Use the provided context as the primary source.
      - Explain answers clearly and deeply.
      - Provide historical background if relevant.
      - Structure answers with paragraphs and bullet points when needed.
      - If context is insufficient, use your general knowledge carefully.
      - Never hallucinate fake facts.

      
      If the answer does not exist in the context,
      reply with:
      "I didn't find that information."
      Do not make up answers.
      CONTEXT:
      --------------------
      START CONTEXT
      ${docContext}
      END CONTEXT
      --------------------
      QUESTION: ${latestMessage}
      --------------------
      `
    }


    const response = await openaiProvider.chat.completions.create({
      model: "qwen2.5:1.5b",
      stream: false,
      messages: [template, ...messages]
    });

    // return new Response(response.toReadableStream());
    return Response.json(response.choices[0].message);

  } catch (err) {
    console.error("Error in POST chat: ", err.message);
    throw err;
  }
}