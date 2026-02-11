import { NextResponse } from "next/server";
import { getIndexedCurves } from "@/lib/indexer";

export const revalidate = 60;

export async function GET() {
  const curves = await getIndexedCurves();
  // Serialize bigints
  const serialized = curves.map((c) => ({
    ...c,
    stxReserve: c.stxReserve.toString(),
    tokensSold: c.tokensSold.toString(),
  }));
  return NextResponse.json(serialized);
}
