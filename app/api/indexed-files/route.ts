import { NextResponse } from "next/server";
import { getIndexedFiles } from "@/app/lib/indexedFiles";

export async function GET() {
  try {
    const files = await getIndexedFiles();

    return NextResponse.json({
      files,
      totalFiles: files.length,
      totalChunks: files.reduce(
        (acc, file) => acc + file.chunks,
        0
      ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load indexed files",
      },
      {
        status: 500,
      }
    );
  }
}