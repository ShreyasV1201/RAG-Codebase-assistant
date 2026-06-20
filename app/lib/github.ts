const GITHUB_API_BASE = "https://api.github.com";

//file for github url parsing and file fetching
type ParsedRepo = {
  owner: string;
  repo: string;
  branch: string;
  repoId: string;
};

type GitHubContentItem = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  download_url: string | null;
  html_url: string;
  size: number;
};

function getGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "codebase-assistant",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export function parseGitHubUrl(input: string): ParsedRepo {
  const cleaned = input.trim().replace(/\.git$/, "");
  const match = cleaned.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+))?(?:\/.*)?$/i,
  );

  if (!match) {
    throw new Error(
      "Invalid GitHub URL. Use something like https://github.com/owner/repo",
    );
  }

  const owner = match[1];
  const repo = match[2];
  const branch = match[3] || "main";

  return {
    owner,
    repo,
    branch,
    repoId: `${owner}-${repo}-${branch}`.toLowerCase(),
  };
}

function isSupportedFile(fileName: string) {
  const allowed = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".json",
    ".md",
    ".txt",
    ".css",
    ".html",
    ".yml",
    ".yaml",
    ".sql",
  ];

  const lower = fileName.toLowerCase();
  return allowed.some((ext) => lower.endsWith(ext));
}

function shouldSkipPath(path: string) {
  const lower = path.toLowerCase();

  const blockedFolders = [
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    "vendor",
    ".git",
    "static/assets",
    "public/assets",

    "static/admin",
    "__pycache__",
    ".venv",
    "venv",
  ];
  if (lower.includes("migrations/")) return true;
  if (lower.includes("static/admin")) return true;

  return blockedFolders.some((folder) => lower.includes(folder.toLowerCase()));
}

async function fetchRepoContents(
  owner: string,
  repo: string,
  path: string,
  branch: string,
) {
  const pathPart = path ? `/${path}` : "";
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents${pathPart}?ref=${encodeURIComponent(
    branch,
  )}`;

  const res = await fetch(url, {
    headers: getGitHubHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }

  return res.json();
}

export type RepoFile = {
  path: string;
  downloadUrl: string;
  htmlUrl: string;
  size: number;
};

export async function getAllRepoFiles(
  owner: string,
  repo: string,
  branch: string,
  path = "",
): Promise<RepoFile[]> {
  const data = await fetchRepoContents(owner, repo, path, branch);

  if (!Array.isArray(data)) {
    return [];
  }

  const results: RepoFile[] = [];

  for (const item of data as GitHubContentItem[]) {
    if (item.type === "dir") {
      const nested = await getAllRepoFiles(owner, repo, branch, item.path);
      results.push(...nested);
    } else if (item.type === "file") {
      if (shouldSkipPath(item.path)) continue;
      if (!isSupportedFile(item.name)) continue;
      if (!item.download_url) continue;

      // Skip huge files
      if (item.size > 150_000) continue;

      results.push({
        path: item.path,
        downloadUrl: item.download_url,
        htmlUrl: item.html_url,
        size: item.size,
      });
    }
  }

  return results;
}

export async function fetchFileText(downloadUrl: string) {
  const res = await fetch(downloadUrl, {
    headers: getGitHubHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file content: ${res.status}`);
  }

  return res.text();
}
