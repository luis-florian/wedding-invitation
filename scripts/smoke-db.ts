import "dotenv/config";

import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { guestCompanions, guests } from "../src/db/schema";
import { getInvitationByToken } from "../src/db/queries/invitation";
import { getMainWedding } from "../src/db/queries/wedding";
import { createGuestToken } from "../src/lib/tokens";

const db = getDb();

async function main() {
  const wedding = await getMainWedding();
  if (!wedding) throw new Error("No wedding found. Run npm run db:seed first.");

  const token = createGuestToken();
  const [guest] = await db
    .insert(guests)
    .values({
      weddingId: wedding.id,
      name: "Smoke Test Guest",
      ownerSide: "groom",
      token
    })
    .returning();

  try {
    const [companion] = await db
      .insert(guestCompanions)
      .values({
        guestId: guest.id,
        name: "Smoke Test Companion"
      })
      .returning();

    const invitation = await getInvitationByToken(token);
    if (!invitation) throw new Error("Invitation lookup by token failed.");
    if (invitation.companions.length !== 1) throw new Error("Companion lookup failed.");

    await db
      .update(guests)
      .set({ status: "confirmed", respondedAt: new Date(), updatedAt: new Date() })
      .where(eq(guests.id, guest.id));

    await db
      .update(guestCompanions)
      .set({ status: "declined", respondedAt: new Date(), updatedAt: new Date() })
      .where(eq(guestCompanions.id, companion.id));

    const updated = await getInvitationByToken(token);
    if (updated?.guest.status !== "confirmed") throw new Error("Guest RSVP update failed.");
    if (updated.companions[0]?.status !== "declined") {
      throw new Error("Companion RSVP update failed.");
    }

    console.log("DB smoke test passed.");
  } finally {
    await db.delete(guests).where(eq(guests.id, guest.id));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
