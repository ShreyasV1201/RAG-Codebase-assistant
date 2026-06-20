"use client";

import { useEffect, useState } from "react";

interface IndexedFile {
  filePath: string;
  chunks: number;
}

export default function IndexedFilesPage() {
  const [files, setFiles] = useState<IndexedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalChunks, setTotalChunks] = useState(0);

  useEffect(() => {
    fetch("/api/indexed-files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files);
        setTotalChunks(data.totalChunks);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Indexed Files
      </h1>

      <div className="mb-4 space-y-1">
        <p>Total Files: {files.length}</p>
        <p>Total Chunks: {totalChunks}</p>
      </div>

      <div className="border rounded-lg">
        {files.map((file) => (
          <div
            key={file.filePath}
            className="flex justify-between border-b p-4"
          >
            <span>{file.filePath}</span>

            <span>{file.chunks} chunks</span>
          </div>
        ))}
      </div>
    </div>
  );
}