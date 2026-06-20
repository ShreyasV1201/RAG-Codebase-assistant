import { NextRequest, NextResponse } from "next/server";
import { queryCodebase } from "@/app/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const { question, repoId, settings } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 },
      );
    }

    const result = await queryCodebase(question, repoId, settings);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Ask failed" }, { status: 500 });
  }
}
