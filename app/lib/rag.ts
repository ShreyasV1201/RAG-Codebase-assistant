import { getCollection } from "./vectorStore";
import { getEmbedding } from "./embeddings";
import { generateAnswer } from "./llm";

type ChunkMeta = {
  repoId?: string;
  repoName?: string;
  repoBranch?: string;
  source?: "upload" | "github";
  filePath?: string;
  fileUrl?: string;
};

export async function storeChunks(
  chunks: any[],
  fileName: string,
  extraMeta: ChunkMeta = {},
) {
  const collection = await getCollection();

  const ids: string[] = [];
  const embeddings: number[][] = [];
  const documents: string[] = [];
  const metadatas: any[] = [];

  const idPrefix = extraMeta.repoId
    ? `${extraMeta.repoId}-${fileName}`
    : fileName;

  for (let i = 0; i < chunks.length; i++) {
    const text: string = chunks[i].pageContent;
    const embedding: number[] = await getEmbedding(text);

    ids.push(`${idPrefix}-${i}`);
    embeddings.push(embedding);
    documents.push(`FILE: ${fileName}\n\n${text}`);
    metadatas.push({
      fileName,
      ...extraMeta,
    });
  }
  console.log("BEFORE ADD", fileName);

  await collection.add({
    ids,
    embeddings,
    documents,
    metadatas,
  });
  console.log("AFTER ADD", fileName);
}

export async function queryCodebase(question: string, repoId?: string) {
  const collection = await getCollection();

  const queryEmbedding: number[] = await getEmbedding(question);

  const result = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 25,
    include: ["documents", "metadatas", "distances"],
    where: repoId ? { repoId } : undefined,
  });

  console.log(result.distances?.[0]);
  console.log(result.metadatas?.[0]);

  const docs = result.documents?.[0] || [];
  const metas = result.metadatas?.[0] || [];

  if (docs.length === 0) {
    return {
      answer: "I could not find that in the codebase.",
      sources: [],
    };
  }

  const context = docs.join("\n\n").slice(0, 12000);

  const answer = await generateAnswer(question, context);

  const sources = [
    ...new Set(
      metas.map((m: any) => m?.filePath || m?.fileName).filter(Boolean),
    ),
  ];

  return {
    answer,
    sources,
  };
}
