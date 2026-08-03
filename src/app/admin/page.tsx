import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/db/queries/admin";
import { ButtonLink } from "@/components/ui/Button";
import styles from "@/components/admin/admin.module.css";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Resumen</p>
          <h1>Confirmaciones</h1>
        </div>
        <ButtonLink href="/admin/guests">Gestionar invitados</ButtonLink>
      </div>

      <section className={`${styles.adminGrid} ${styles.gridFour}`}>
        <Metric label="Total personas" value={stats.totalPeople} href="/admin/guests" />
        <Metric label="Confirmados" value={stats.confirmedPeople} href="/admin/guests?status=confirmed" />
        <Metric label="Pendientes" value={stats.pendingPeople} href="/admin/guests?status=pending" />
        <Metric label="No asistiran" value={stats.declinedPeople} href="/admin/guests?status=declined" />
      </section>

      <section className={`${styles.adminGrid} ${styles.gridThree}`} style={{ marginTop: 16 }}>
        <Metric label="Personas novio" value={stats.groomPeople} href="/admin/guests?view=groom" />
        <Metric label="Personas novia" value={stats.bridePeople} href="/admin/guests?view=bride" />
        <Metric label="Invitados principales" value={stats.total} href="/admin/guests" />
      </section>

      <section className={`${styles.adminGrid} ${styles.gridTwo}`} style={{ marginTop: 16 }}>
        <Metric label="Invitaciones enviadas" value={stats.sentInvitations} href="/admin/guests?sent=true" />
        <Metric label="Invitaciones no enviadas" value={stats.unsentInvitations} href="/admin/guests?sent=false" />
      </section>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className={`${styles.panel} ${styles.metric} ${styles.metricLink}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>Ver lista</small>
    </Link>
  );
}
