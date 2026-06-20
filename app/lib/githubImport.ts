import { parseGitHubUrl, getAllRepoFiles, fetchFileText } from "./github";
import { storeChunks } from "./rag";
import { chunkText } from "./chunkText";
import { getCollection } from "./vectorStore";

type ImportedFile = {
  path: string;
  htmlUrl: string;
  size: number;
  chunks: number;
};

export async function importGitHubRepository(repoUrl: string) {
  const repo = parseGitHubUrl(repoUrl);

  const files = await getAllRepoFiles(repo.owner, repo.repo, repo.branch);

  const collection = await getCollection();

  console.log("COUNT BEFORE IMPORT =", await collection.count());

  let indexedFiles = 0;
  let totalChunks = 0;

  const importedFiles: ImportedFile[] = [];

  for (const file of files) {
    const content = await fetchFileText(file.downloadUrl);

    if (!content.trim()) continue;

    const chunks = await chunkText(content);
    if (!chunks.length) continue;

    await storeChunks(chunks, file.path, {
      repoId: repo.repoId,
      repoName: `${repo.owner}/${repo.repo}`,
      repoBranch: repo.branch,
      source: "github",
      filePath: file.path,
      fileUrl: file.htmlUrl,
    });

    indexedFiles++;
    totalChunks += chunks.length;

    importedFiles.push({
      path: file.path,
      htmlUrl: file.htmlUrl,
      size: file.size,
      chunks: chunks.length,
    });
  }

  const count = await collection.count();
  console.log("CHROMA COUNT =", count);

  return {
    repoId: repo.repoId,
    repoName: `${repo.owner}/${repo.repo}`,
    branch: repo.branch,
    totalFiles: files.length,
    indexedFiles,
    totalChunks,
    files: importedFiles,
  };
}
