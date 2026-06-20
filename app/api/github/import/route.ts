import { NextRequest, NextResponse } from "next/server";
import { importGitHubRepository } from "@/app/lib/githubImport";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "GitHub repository URL is required",
        },
        { status: 400 }
      );
    }

    const result = await importGitHubRepository(url);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("GitHub Import Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to import repository",
      },
      { status: 500 }
    );
  }
}