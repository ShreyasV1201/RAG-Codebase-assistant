import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function chunkText(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 300,
  });

  const chunks = await splitter.createDocuments([text]);

  return chunks;
}
