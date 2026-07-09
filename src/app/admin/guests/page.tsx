import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { getGuestTableRows } from "@/db/queries/admin";
import { requireAdmin } from "@/lib/auth";
import { parseGuestView, parseStatusFilter } from "@/lib/admin-filters";
import { statusLabels } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GuestsTable } from "@/components/admin/GuestsTable";
import styles from "@/components/admin/admin.module.css";

export default async function AdminGuestsPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; status?: string; q?: string }>;
}) {
  const [admin, query] = await Promise.all([requireAdmin(), searchParams]);
  const view = parseGuestView(query.view);
  const status = parseStatusFilter(query.status);
  const search = typeof query.q === "string" ? query.q.trim() : "";
  const allRows = await getGuestTableRows(view, status);
  const rows = search
    ? allRows.filter((row) => {
        const value = `${row.name} ${row.principalName}`.toLowerCase();
        return value.includes(search.toLowerCase());
      })
    : allRows;

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Lista</p>
          <h1>Invitados</h1>
        </div>
        <ButtonLink href="/admin/guests/new">
          <Plus size={16} aria-hidden="true" />
          Agregar invitado
        </ButtonLink>
      </div>

      <nav className={styles.viewTabs} aria-label="Vistas de invitados">
        <Tab href={guestHref("all", status)} active={view === "all"}>Todos</Tab>
        <Tab href={guestHref("groom", status)} active={view === "groom"}>Invitados novio</Tab>
        <Tab href={guestHref("bride", status)} active={view === "bride"}>Invitados novia</Tab>
      </nav>

      <form className={`${styles.panel} ${styles.filterBar}`} action="/admin/guests">
        {view !== "all" ? <input type="hidden" name="view" value={view} /> : null}
        <label>
          <span>Estado</span>
          <select name="status" defaultValue={status ?? ""}>
            <option value="">Todos los estados</option>
            <option value="pending">{statusLabels.pending}</option>
            <option value="confirmed">{statusLabels.confirmed}</option>
            <option value="declined">{statusLabels.declined}</option>
          </select>
        </label>
        <label>
          <span>Buscar</span>
          <input name="q" defaultValue={search} placeholder="Nombre o invitado principal" />
        </label>
        <Button type="submit" variant="secondary">
          <Search size={16} aria-hidden="true" />
          Filtrar
        </Button>
      </form>

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
