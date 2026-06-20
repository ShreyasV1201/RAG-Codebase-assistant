import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

const COLLECTION_NAME = "codebase2";

export async function getCollection() {
  return client.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction: null,
  });
}

export async function resetCollection() {
  try {
    await client.deleteCollection({
      name: COLLECTION_NAME,
    });
  } catch (error) {
    console.log("Collection did not exist, creating fresh one.");
  }

  return client.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction: null,
  });
}
