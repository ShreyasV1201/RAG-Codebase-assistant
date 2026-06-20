"use client";

import { useState } from "react";

type ImportResult = {
  success: boolean;
  repoId: string;
  repoName: string;
  branch: string;
  totalFiles: number;
  indexedFiles: number;
  totalChunks: number;
  files: SourceFile[];
};

type SourceFile = {
  path: string;
  htmlUrl: string;
  size: number;
  chunks: number;
};

type AskResult = {
  answer: string;
  sources?: string[];
};

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState("");
  const [askError, setAskError] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  const handleImport = async () => {
    if (!url.trim()) {
      setError("Paste a GitHub repo URL first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAnswer("");
    setAskError("");

    try {
      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      setAskError("Type a question first.");
      return;
    }

    setAsking(true);
    setAskError("");
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.error || "Ask failed");
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err: any) {
      setAskError(err.message || "Failed to get an answer.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Import GitHub Repository
          </h1>
          <p className="mt-2 text-zinc-400">
            Paste a GitHub repo URL, index it, then ask questions about the
            imported codebase on the same page.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/30">
          <div className="space-y-4">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-red-500"
            />

            <button
              onClick={handleImport}
              disabled={loading}
              className="rounded-2xl bg-red-700 px-5 py-3 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Importing..." : "Start Import"}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </section>

        {result && (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/30">
            <h2 className="text-xl font-semibold">Import Complete</h2>
            <div className="mt-4 grid gap-2 text-sm text-zinc-300">
              <p>
                <span className="text-zinc-500">Repo:</span> {result.repoName}
              </p>
              <p>
                <span className="text-zinc-500">Branch:</span> {result.branch}
              </p>
              <p>
                <span className="text-zinc-500">Total files found:</span>{" "}
                {result.totalFiles}
              </p>
              <p>
                <span className="text-zinc-500">Files indexed:</span>{" "}
                {result.indexedFiles}
              </p>
              <p>
                <span className="text-zinc-500">Total chunks:</span>{" "}
                {result.totalChunks}
              </p>
              <p className="text-zinc-500">Repo ID: {result.repoId}</p>
            </div>
          </section>
        )}


        {result && (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/30">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Ask about this repository
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Ask questions about the imported codebase below.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !asking) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="How does authentication work? What database is used? Where are the main routes?"
                className="min-h-36 w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-red-500"
              />

              <button
                onClick={handleAsk}
                disabled={asking}
                className="rounded-2xl border border-red-900/40 bg-zinc-950 px-5 py-3 font-medium text-zinc-100 transition hover:border-red-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {asking ? "Asking..." : "Ask"}
              </button>

              {askError && <p className="text-sm text-red-400">{askError}</p>}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="mb-2 text-sm font-medium text-zinc-400">Answer</p>
                <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
                  {answer || "The answer will appear here."}
                </pre>
              </div>
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="mb-3 text-sm font-medium text-zinc-400">
              Relevant Sources
            </p>

            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source}
                  className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300"
                >
                  {source}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
