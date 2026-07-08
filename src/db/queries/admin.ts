import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  guestCompanions,
  guests,
  type AdminSide,
  type RsvpStatus
} from "@/db/schema";
import { getMainWedding } from "./wedding";

export type GuestView = "all" | AdminSide;

export async function getGuestRows(view: GuestView = "all", status?: RsvpStatus) {
  const db = getDb();
  const wedding = await getMainWedding();
  if (!wedding) return [];

  const filters = [eq(guests.weddingId, wedding.id)];
  if (view !== "all") filters.push(eq(guests.ownerSide, view));
  if (status) filters.push(eq(guests.status, status));

  const guestRows = await db
    .select()
    .from(guests)
    .where(and(...filters))
    .orderBy(asc(guests.ownerSide), asc(guests.name));

  if (guestRows.length === 0) return [];

  const companions = await db
    .select()
    .from(guestCompanions)
    .where(
      inArray(
        guestCompanions.guestId,
        guestRows.map((guest) => guest.id)
      )
    )
    .orderBy(asc(guestCompanions.sortOrder), asc(guestCompanions.createdAt));

  return guestRows.map((guest) => ({
    ...guest,
    companions: companions.filter((companion) => companion.guestId === guest.id)
  }));
}

export async function getDashboardStats() {
  const db = getDb();
  const wedding = await getMainWedding();
  if (!wedding) {
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      declined: 0,
      groom: 0,
      bride: 0,
      companions: 0
    };
  }

  const [guestStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      confirmed: sql<number>`count(*) filter (where ${guests.status} = 'confirmed')::int`,
      pending: sql<number>`count(*) filter (where ${guests.status} = 'pending')::int`,
      declined: sql<number>`count(*) filter (where ${guests.status} = 'declined')::int`,
      groom: sql<number>`count(*) filter (where ${guests.ownerSide} = 'groom')::int`,
      bride: sql<number>`count(*) filter (where ${guests.ownerSide} = 'bride')::int`
    })
    .from(guests)
    .where(eq(guests.weddingId, wedding.id));

  const [companionStats] = await db
    .select({
      total: sql<number>`count(*)::int`
    })
    .from(guestCompanions)
    .innerJoin(guests, eq(guestCompanions.guestId, guests.id))
    .where(eq(guests.weddingId, wedding.id));

  return {
    ...guestStats,
    companions: companionStats.total
  };
}
