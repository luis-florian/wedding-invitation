import { notFound } from "next/navigation";
import { getGuestById, getGuestRows } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth";
import { normalizeSearchText } from "@/lib/text";
import { GuestEditor } from "@/components/admin/GuestEditor";
import styles from "@/components/admin/admin.module.css";

export default async function AdminGuestEditPage({
  params,
  searchParams
}: {
  params: Promise<{ guestId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [admin, { guestId }, query] = await Promise.all([requireAdmin(), params, searchParams]);
  const guest = await getGuestById(guestId);

  if (!guest) notFound();
  const companionNames = new Set(
    guest.companions.map((companion) => normalizeSearchText(companion.name))
  );
  const candidates =
    admin.side === guest.ownerSide
      ? (await getGuestRows(guest.ownerSide)).filter(
          (candidate) =>
            candidate.id !== guest.id &&
            candidate.companions.length === 0 &&
            !companionNames.has(normalizeSearchText(candidate.name))
        )
      : [];

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <GuestEditor
        guest={guest}
        adminSide={admin.side}
        assignableGuests={candidates}
        saved={query.saved}
      />
    </main>
  );
}
