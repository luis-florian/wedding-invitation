import { notFound } from "next/navigation";
import { getGuestById, getGuestRows } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth";
import { GuestEditor } from "@/components/admin/GuestEditor";
import styles from "@/components/admin/admin.module.css";

export default async function AdminGuestEditPage({
  params
}: {
  params: Promise<{ guestId: string }>;
}) {
  const [admin, { guestId }] = await Promise.all([requireAdmin(), params]);
  const guest = await getGuestById(guestId);

  if (!guest) notFound();
  const candidates =
    admin.side === guest.ownerSide
      ? (await getGuestRows(guest.ownerSide)).filter(
          (candidate) => candidate.id !== guest.id && candidate.companions.length === 0
        )
      : [];

  return (
    <main className={`shell ${styles.adminPage}`}>
      <GuestEditor guest={guest} adminSide={admin.side} assignableGuests={candidates} />
    </main>
  );
}
