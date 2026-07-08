import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import {
  adminUsers,
  guestCompanions,
  guests,
  weddingEvents,
  weddings
} from "../src/db/schema";
import { createGuestToken } from "../src/lib/tokens";

const db = getDb();

async function main() {
  const [existingWedding] = await db.select().from(weddings).limit(1);

  const wedding =
    existingWedding ??
    (
      await db
        .insert(weddings)
        .values({
          coupleNames: "Luis & Yana",
          weddingDate: new Date("2026-12-12T17:00:00-06:00"),
          heroImageUrl: "",
          introMessage:
            "Con mucha alegria queremos invitarte a celebrar este dia tan especial con nosotros.",
          finalMessage: "Gracias por confirmar. Sera un honor compartir este momento contigo."
        })
        .returning()
    )[0];

  const existingEvents = await db
    .select()
    .from(weddingEvents)
    .where(eq(weddingEvents.weddingId, wedding.id));

  if (existingEvents.length === 0) {
    await db.insert(weddingEvents).values([
      {
        weddingId: wedding.id,
        name: "Ceremonia",
        startsAt: new Date("2026-12-12T17:00:00-06:00"),
        endsAt: new Date("2026-12-12T18:00:00-06:00"),
        address: "Direccion de la ceremonia",
        description: "Acompanenos en la ceremonia.",
        notes: "Llegar con 20 minutos de anticipacion.",
        googleMapsUrl: "",
        wazeUrl: "",
        sortOrder: 1
      },
      {
        weddingId: wedding.id,
        name: "Recepcion",
        startsAt: new Date("2026-12-12T18:30:00-06:00"),
        endsAt: new Date("2026-12-12T23:00:00-06:00"),
        address: "Direccion de la recepcion",
        description: "Celebremos juntos despues de la ceremonia.",
        notes: "",
        googleMapsUrl: "",
        wazeUrl: "",
        sortOrder: 2
      }
    ]);
  }

  const admins = [
    {
      email: process.env.SEED_GROOM_EMAIL ?? "novio@example.com",
      password: process.env.SEED_GROOM_PASSWORD ?? "change-me",
      name: "Novio",
      side: "groom" as const
    },
    {
      email: process.env.SEED_BRIDE_EMAIL ?? "novia@example.com",
      password: process.env.SEED_BRIDE_PASSWORD ?? "change-me",
      name: "Novia",
      side: "bride" as const
    }
  ];

  for (const admin of admins) {
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, admin.email))
      .limit(1);

    if (!existing) {
      await db.insert(adminUsers).values({
        email: admin.email,
        name: admin.name,
        side: admin.side,
        passwordHash: await bcrypt.hash(admin.password, 12)
      });
    }
  }

  const existingGuests = await db.select().from(guests).where(eq(guests.weddingId, wedding.id));

  if (existingGuests.length === 0) {
    const [groomGuest] = await db
      .insert(guests)
      .values({
        weddingId: wedding.id,
        name: "Familia Perez",
        phone: "+502 5555 0001",
        ownerSide: "groom",
        token: createGuestToken()
      })
      .returning();

    const [brideGuest] = await db
      .insert(guests)
      .values({
        weddingId: wedding.id,
        name: "Familia Garcia",
        phone: "+502 5555 0002",
        ownerSide: "bride",
        token: createGuestToken()
      })
      .returning();

    await db.insert(guestCompanions).values([
      { guestId: groomGuest.id, name: "Acompanante Perez", sortOrder: 1 },
      { guestId: brideGuest.id, name: "Acompanante Garcia", sortOrder: 1 }
    ]);
  }

  console.log("Seed completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
