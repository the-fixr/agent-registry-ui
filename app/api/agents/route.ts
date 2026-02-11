import { NextResponse } from "next/server";
import { getIndexedAgents } from "@/lib/indexer";

export const revalidate = 60;

export async function GET() {
  const agents = await getIndexedAgents();
  // Serialize bigints
  const serialized = agents.map((a) => ({
    ...a,
    pricePerTask: a.pricePerTask.toString(),
  }));
  return NextResponse.json(serialized);
}
