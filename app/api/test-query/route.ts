import { NextResponse } from "next/server";
import { queryCodebase } from "@/app/lib/rag";

export async function GET() {
  const result = await queryCodebase(
    "What database does this project use?",
    "shreyasv1201-expense-tracker-main"
  );

  console.log(result);

  return NextResponse.json(result);
}