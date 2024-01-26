import { PEERS } from "@/features/peers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(PEERS);
}
