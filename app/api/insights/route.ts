import { NextResponse } from "next/server";
import { getInsights } from "@/app/lib/insights";

export async function GET() {
  try {
    const insights = await getInsights();

    return NextResponse.json(insights);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch insights",
      },
      {
        status: 500,
      }
    );
  }
}