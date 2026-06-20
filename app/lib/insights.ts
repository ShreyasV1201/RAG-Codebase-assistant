import { getCollection } from "./vectorStore";

const languageNames: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript React",
  js: "JavaScript",
  jsx: "React",
  py: "Python",
  md: "Markdown",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  yml: "YAML",
  yaml: "YAML",
  sql: "SQL",
};

export async function getInsights() {
  const collection = await getCollection();

  const result = await collection.get();

  const metadatas = result.metadatas || [];

  const fileMap = new Map<string, number>();
  const languageMap = new Map<string, number>();

  const totalChunks = metadatas.length;

  for (const meta of metadatas) {
    const filePath = meta?.filePath as string;

    if (!filePath) continue;

    fileMap.set(
      filePath,
      (fileMap.get(filePath) || 0) + 1
    );

    const ext = filePath.split(".").pop()?.toLowerCase();

    const language =
      languageNames[ext || ""] || ext || "Unknown";

    languageMap.set(
      language,
      (languageMap.get(language) || 0) + 1
    );
  }

  return {
    totalFiles: fileMap.size,
    totalChunks,
    languages: Array.from(languageMap.entries()).sort(
      (a, b) => b[1] - a[1]
    ),
    topFiles: Array.from(fileMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  };
}