import { getCollection } from "./vectorStore";

export async function getIndexedFiles() {
  const collection = await getCollection();

  const result = await collection.get();

  const fileMap = new Map();

  result.metadatas?.forEach((metadata) => {
    const filePath = metadata?.filePath as string;
    const repoName = metadata?.repoName as string;
    const fileUrl = metadata?.fileUrl as string;

    if (!filePath) return;

    if (!fileMap.has(filePath)) {
      fileMap.set(filePath, {
        filePath,
        repoName,
        fileUrl,
        chunks: 0,
      });
    }

    fileMap.get(filePath).chunks++;
  });

  return Array.from(fileMap.values());
}