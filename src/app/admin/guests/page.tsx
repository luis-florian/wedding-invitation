import Link from "next/link";
import { getGuestTableRows } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth";
import { parseGuestView, parseStatusFilter } from "@/lib/admin-filters";
import { statusLabels } from "@/lib/format";
import { CreateGuestForm } from "@/components/admin/GuestForms";
import { GuestsTable } from "@/components/admin/GuestsTable";
import styles from "@/components/admin/admin.module.css";

export default async function AdminGuestsPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; status?: string }>;
}) {
  const [admin, query] = await Promise.all([requireAdmin(), searchParams]);
  const view = parseGuestView(query.view);
  const status = parseStatusFilter(query.status);
  const rows = await getGuestTableRows(view, status);

  return (
    <main className={`shell ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Lista</p>
          <h1>Invitados</h1>
        </div>
      </div>

      <nav className={styles.tabs} aria-label="Vistas de invitados">
        <Tab href={guestHref("all", status)} active={view === "all"}>Todos</Tab>
        <Tab href={guestHref("groom", status)} active={view === "groom"}>Invitados novio</Tab>
        <Tab href={guestHref("bride", status)} active={view === "bride"}>Invitados novia</Tab>
      </nav>

      <nav className={styles.tabs} aria-label="Filtros por estado">
        <Tab href={guestHref(view)} active={!status}>Todos los estados</Tab>
        <Tab href={guestHref(view, "pending")} active={status === "pending"}>
          {statusLabels.pending}
        </Tab>
        <Tab href={guestHref(view, "confirmed")} active={status === "confirmed"}>
          {statusLabels.confirmed}
        </Tab>
        <Tab href={guestHref(view, "declined")} active={status === "declined"}>
          {statusLabels.declined}
        </Tab>
      </nav>

      <CreateGuestForm adminSide={admin.side} />

      <section style={{ marginTop: 16 }}>
        <GuestsTable rows={rows} adminSide={admin.side} />
      </section>
    </main>
  );
}

function guestHref(view: "all" | "groom" | "bride", status?: string) {
  const params = new URLSearchParams();
  if (view !== "all") params.set("view", view);
  if (status) params.set("status", status);
  const query = params.toString();
  return `/admin/guests${query ? `?${query}` : ""}`;
}

function Tab({
  href,
  active,
  children
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} data-active={active}>
      {children}
    </Link>
  );
}
