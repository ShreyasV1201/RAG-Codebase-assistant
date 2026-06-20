"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [repoId, setRepoId] = useState("");
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    const loadRepos = async () => {
      const res = await fetch("/api/repos");
      const data = await res.json();

      console.log(data);

      setRepos(data.repos || []);
    };

    loadRepos();
  }, []);

  const handleUpload = async () => {
    if (!files) {
      setResponse("Please upload files first.");
      return;
    }

    try {
      setIsUploading(true);
      setResponse("");

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse("Upload done:\n" + JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setIsAsking(true);
      setResponse("");

      const settings = JSON.parse(localStorage.getItem("rag-settings") || "{}");

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          repoId,
          settings,
        }),
      });

      const data = await res.json();

      setResponse(data?.result?.answer || "No answer returned.");
    } catch (error) {
      setResponse("Failed to get a response. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const features = [
    {
      title: "GitHub Repo Import",
      description: "Import a codebase directly from GitHub.",
      href: "/import",
    },
    {
      title: "Indexed Files",
      description: "View files already processed and indexed.",
      href: "/indexed-files",
    },
    {
      title: "Code Insights",
      description: "See structure, patterns, and useful summaries.",
      href: "/insights",
    },
    {
      title: "Settings",
      description: "Tune chunk size, retrieval count, and model.",
      href: "/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Codebase Assistant
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Your codebase, searchable and explainable.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              Upload files, ask questions, inspect code, and prepare for GitHub
              imports, insights, and indexed file views.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-red-900/40 bg-red-950/30 px-3 py-1 text-xs text-red-300">
              Phase 1: Core app
            </span>
            <span className="rounded-full border border-red-800/40 bg-red-900/20 px-3 py-1 text-xs text-red-400">
              Phase 2: Smart features
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
              Phase 3: Advanced
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl shadow-black/40">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-zinc-50">
                  Ask the codebase
                </h2>
                <span className="text-xs text-zinc-500">Main chat area</span>
              </div>

              <select
                value={repoId}
                onChange={(e) => setRepoId(e.target.value)}
                className="mb-4 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100"
              >
                <option value="">All Repositories</option>

                {repos.map((repo) => (
                  <option key={repo.repoId} value={repo.repoId}>
                    {repo.repoName}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Ask something like: Where is authentication handled?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-36 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-red-500"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-500 hover:text-red-300 sm:flex-1">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                  />
                  {files ? `${files.length} file(s) selected` : "Choose files"}
                </label>

                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="rounded-2xl bg-red-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  onClick={handleAsk}
                  disabled={isAsking}
                  className="rounded-2xl border border-red-900/40 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition hover:border-red-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAsking ? "Asking..." : "Ask"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl shadow-black/40">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-zinc-50">Response</h2>
                <span className="text-xs text-zinc-500">Output panel</span>
              </div>

              <div className="min-h-[220px] rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-200">
                  {response || "Response appears here..."}
                </pre>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl shadow-black/40">
              <h2 className="mb-4 text-xl font-semibold text-zinc-50">
                Quick actions
              </h2>

              <div className="grid gap-3">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-red-500 hover:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-zinc-100 group-hover:text-red-300">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {feature.description}
                        </p>
                      </div>
                      <span className="text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-red-300">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl shadow-black/40">
              <h2 className="mb-3 text-xl font-semibold text-zinc-50">
                Project phases
              </h2>

              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-medium text-zinc-100">Phase 1</p>
                  <p className="mt-1 text-zinc-400">
                    Chat UI, syntax highlighting, citations, loading states,
                    sidebar.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-medium text-zinc-100">Phase 2</p>
                  <p className="mt-1 text-zinc-400">
                    GitHub import, insights, indexed files.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-medium text-zinc-100">Phase 3</p>
                  <p className="mt-1 text-zinc-400">
                    Streaming, memory, AST chunking, multi-repo support.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
