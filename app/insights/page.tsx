"use client";

import { useEffect, useState } from "react";

type InsightData = {
  totalFiles: number;
  totalChunks: number;
  languages: [string, number][];
  topFiles: [string, number][];
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
        Loading insights...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
        Failed to load insights.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Code Insights</h1>
          <p className="mt-2 text-zinc-400">
            Repository statistics and codebase overview.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Files Indexed</p>
            <p className="mt-2 text-3xl font-bold">
              {data.totalFiles}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Chunks Stored</p>
            <p className="mt-2 text-3xl font-bold">
              {data.totalChunks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Languages Found</p>
            <p className="mt-2 text-3xl font-bold">
              {data.languages.length}
            </p>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Language Breakdown
          </h2>

          <div className="space-y-3">
            {data.languages.map(([language, count]) => (
              <div
                key={language}
                className="flex justify-between rounded-xl border border-zinc-800 px-4 py-3"
              >
                <span>
                  {language || "unknown"}
                </span>

                <span className="text-zinc-400">
                  {count} file(s)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Chunked Files */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Most Chunked Files
          </h2>

          <div className="space-y-3">
            {data.topFiles.map(([file, chunks]) => (
              <div
                key={file}
                className="flex justify-between rounded-xl border border-zinc-800 px-4 py-3"
              >
                <span className="truncate">
                  {file}
                </span>

                <span className="text-zinc-400">
                  {chunks} chunks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}