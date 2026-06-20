import { NextResponse } from "next/server";
import { getCollection } from "@/app/lib/vectorStore";

export async function GET() {
  try {
    const collection = await getCollection();

    const result = await collection.get({
      include: ["metadatas"],
    });

    const repoMap = new Map();

    result.metadatas?.forEach((meta: any) => {
      if (!meta?.repoId) return;

      if (!repoMap.has(meta.repoId)) {
        repoMap.set(meta.repoId, {
          repoId: meta.repoId,
          repoName: meta.repoName,
          repoBranch: meta.repoBranch,
        });
      }
    });

    return NextResponse.json({
      success: true,
      repos: Array.from(repoMap.values()),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to load repos" },
      { status: 500 }
    );
  }
}