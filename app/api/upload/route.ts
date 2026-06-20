import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/app/lib/extractText";
import { chunkText } from "@/app/lib/chunkText";
import { storeChunks } from "@/app/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. extract text
    const extractedText = await extractText(file, buffer);

    console.log("EXTRACTED TEXT:");
    console.log(extractedText);

    // 2. chunk text
    const chunks = await chunkText(extractedText);

    console.log("CHUNKS:");
    console.log(chunks);

    // 3. STORE IN VECTOR DB (THIS WAS MISSING)
    await storeChunks(chunks, file.name);

    return NextResponse.json({
      success: true,
      chunksCount: chunks.length,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}