import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";

type SimilarityMetricType = "dot_product" | "cosine" | "euclidean";

const {
  GEMINI_API_KEY,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const ragData = [
  "https://en.wikipedia.org/wiki/Indonesia",
  "https://id.wikipedia.org/wiki/Proklamasi_Kemerdekaan_Indonesia",
  "https://sarolangunkab.go.id/artikel/baca/sejarah-singkat-hari-kemerdekaan-indonesia-17-agustus-1945",
  "https://kab-jayawijaya.kpu.go.id/blog/read/8076_profil-lengkap-republik-indonesia-sejarah-bentuk-negara-dan-wilayahnya",
  "https://id.wikipedia.org/wiki/Sejarah_Indonesia",
  "https://www.brainacademy.id/blog/pahlawan-nasional",
  "https://id.wikipedia.org/wiki/Pahlawan_nasional_Indonesia",
  "https://id.wikipedia.org/wiki/Mitos_penjajahan_350_tahun",
  "https://data360.worldbank.org/en/economy/IDN",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (metric: SimilarityMetricType = "dot_product") => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
    vector: {
      dimension: 3072,  // ✅ sesuai gemini-embedding-001
      metric,
    },
  });

  console.log("Result create collection:", res);
};

const scrapePage = async (url: string): Promise<string> => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: "domcontentloaded" },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });

  const scraped = await loader.scrape();
  // PERUBAHAN: tambah fallback string kosong agar tidak crash jika scrape() return null
  return (scraped ?? "").replace(/<[^>]*>?/gm, "");
};

const loadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION!);

  for (const url of ragData) {
    console.log(`Scraping: ${url}`);
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    for (const chunk of chunks) {
      // PERUBAHAN: format `contents` menggunakan string biasa, bukan object
      // SDK @google/genai menerima string langsung untuk embedContent
      const embeddingResponse = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
      });

      const vector = embeddingResponse.embeddings[0].values;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log("Inserted chunk:", res);
    }
  }
};

const run = async () => {
  try {
    // Hapus collection lama dulu
    try {
      await db.dropCollection(ASTRA_DB_COLLECTION!);
      console.log("Collection lama dihapus.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      console.log("Collection belum ada, skip drop.");
    }

    console.log("Memulai pembuatan koleksi...");
    await createCollection();

    console.log("Memulai loading data...");
    await loadSampleData();

    console.log("Selesai!");
  } catch (error) {
    console.error("Error:", error);
  }
};

run();