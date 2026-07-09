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
        <Metric label="Total personas" value={stats.totalPeople} />
        <Metric label="Confirmados" value={stats.confirmedPeople} />
        <Metric label="Pendientes" value={stats.pendingPeople} />
        <Metric label="No asistiran" value={stats.declinedPeople} />
      </section>

      <section className={`${styles.adminGrid} ${styles.gridThree}`} style={{ marginTop: 16 }}>
        <Metric label="Personas novio" value={stats.groomPeople} />
        <Metric label="Personas novia" value={stats.bridePeople} />
        <Metric label="Invitados principales" value={stats.total} />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className={`${styles.panel} ${styles.metric}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
