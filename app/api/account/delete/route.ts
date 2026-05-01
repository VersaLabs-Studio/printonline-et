import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Account deletion is temporarily disabled. Please contact support." },
    { status: 503 }
  );
}
