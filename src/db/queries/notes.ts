import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminNotes, type AdminSide } from "@/db/schema";

export async function getAdminNotes() {
  const db = getDb();
  return db.select().from(adminNotes).orderBy(asc(adminNotes.side));
}

export async function getAdminNoteBySide(side: AdminSide) {
  const db = getDb();
  const [note] = await db
    .select()
    .from(adminNotes)
    .where(eq(adminNotes.side, side))
    .limit(1);

  return note ?? null;
}
