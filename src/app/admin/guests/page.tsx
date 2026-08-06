import Link from "next/link";
import { Plus, RotateCcw, Search } from "lucide-react";
import { getGuestTableRows } from "@/db/queries/admin";
import { getMainWedding } from "@/db/queries/wedding";
import { requireAdmin } from "@/lib/auth";
import {
  parseGuestView,
  parseInvitationSentFilter,
  parseStatusFilter
} from "@/lib/admin-filters";
import { normalizeSearchText } from "@/lib/text";
import { statusLabels } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GuestsTable } from "@/components/admin/GuestsTable";
import styles from "@/components/admin/admin.module.css";

export default async function AdminGuestsPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; status?: string; sent?: string; q?: string }>;
}) {
  const [admin, query, wedding] = await Promise.all([
    requireAdmin(),
    searchParams,
    getMainWedding()
  ]);
  const view = parseGuestView(query.view);
  const status = parseStatusFilter(query.status);
  const invitationSent = parseInvitationSentFilter(query.sent);
  const search = typeof query.q === "string" ? query.q.trim() : "";
  const normalizedSearch = normalizeSearchText(search);
  const allRows = await getGuestTableRows(view, status, invitationSent);
  const rows = search
    ? allRows.filter((row) => {
        const value = normalizeSearchText(`${row.name} ${row.principalName}`);
        return value.includes(normalizedSearch);
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
        <Tab href={guestHref("all", { status, invitationSent, search })} active={view === "all"}>Todos</Tab>
        <Tab href={guestHref("groom", { status, invitationSent, search })} active={view === "groom"}>Invitados novio</Tab>
        <Tab href={guestHref("bride", { status, invitationSent, search })} active={view === "bride"}>Invitados novia</Tab>
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
          <span>Invitacion</span>
          <select name="sent" defaultValue={invitationSent === undefined ? "" : String(invitationSent)}>
            <option value="">Todas</option>
            <option value="true">Enviadas</option>
            <option value="false">No enviadas</option>
          </select>
        </label>
        <label>
          <span>Buscar</span>
          <input name="q" defaultValue={search} placeholder="Nombre o invitado principal" />
        </label>
        <div className={styles.filterActions}>
          <Button type="submit" variant="secondary">
            <Search size={16} aria-hidden="true" />
            Filtrar
          </Button>
          <ButtonLink href="/admin/guests" variant="ghost">
            <RotateCcw size={16} aria-hidden="true" />
            Limpiar
          </ButtonLink>
        </div>
      </form>

      <section style={{ marginTop: 16 }}>
        <GuestsTable rows={rows} adminSide={admin.side} inviteMessage={wedding?.inviteMessage} />
      </section>
    </main>
  );
}

function guestHref(
  view: "all" | "groom" | "bride",
  filters: { status?: string; invitationSent?: boolean; search?: string }
) {
  const params = new URLSearchParams();
  if (view !== "all") params.set("view", view);
  if (filters.status) params.set("status", filters.status);
  if (filters.invitationSent !== undefined) {
    params.set("sent", String(filters.invitationSent));
  }
  if (filters.search) params.set("q", filters.search);
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
