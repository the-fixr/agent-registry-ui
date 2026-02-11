import { NextResponse } from "next/server";
import { getIndexedTasks } from "@/lib/indexer";

export const revalidate = 60;

export async function GET() {
  const tasks = await getIndexedTasks();
  const serialized = tasks.map((t) => ({
    ...t,
    bounty: t.bounty.toString(),
  }));
  return NextResponse.json(serialized);
}
