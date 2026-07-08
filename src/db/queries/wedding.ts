import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { weddings, weddingEvents } from "@/db/schema";

export async function getMainWedding() {
  const db = getDb();
  const [wedding] = await db.select().from(weddings).limit(1);
  return wedding ?? null;
}

export async function getWeddingWithEvents() {
  const db = getDb();
  const wedding = await getMainWedding();
  if (!wedding) return null;

  const events = await db
    .select()
    .from(weddingEvents)
    .where(eq(weddingEvents.weddingId, wedding.id))
    .orderBy(asc(weddingEvents.sortOrder), asc(weddingEvents.startsAt));

  return { wedding, events };
}
