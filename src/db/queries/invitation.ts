import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { guestCompanions, guests, weddingEvents, weddings } from "@/db/schema";

export async function getInvitationByToken(token: string) {
  const db = getDb();
  const [guest] = await db.select().from(guests).where(eq(guests.token, token)).limit(1);
  if (!guest) return null;

  const [wedding] = await db
    .select()
    .from(weddings)
    .where(eq(weddings.id, guest.weddingId))
    .limit(1);

  if (!wedding) return null;

  const [events, companions] = await Promise.all([
    db
      .select()
      .from(weddingEvents)
      .where(eq(weddingEvents.weddingId, wedding.id))
      .orderBy(asc(weddingEvents.sortOrder), asc(weddingEvents.startsAt)),
    db
      .select()
      .from(guestCompanions)
      .where(eq(guestCompanions.guestId, guest.id))
      .orderBy(asc(guestCompanions.sortOrder), asc(guestCompanions.createdAt))
  ]);

  return { wedding, guest, events, companions };
}
