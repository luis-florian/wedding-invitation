import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/db/queries/admin";
import { ButtonLink } from "@/components/ui/Button";
import styles from "@/components/admin/admin.module.css";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <main className={`shell ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Resumen</p>
          <h1>Confirmaciones</h1>
        </div>
        <ButtonLink href="/admin/guests">Gestionar invitados</ButtonLink>
      </div>

      <section className="grid four">
        <Metric label="Total principales" value={stats.total} />
        <Metric label="Confirmados" value={stats.confirmed} />
        <Metric label="Pendientes" value={stats.pending} />
        <Metric label="No asistiran" value={stats.declined} />
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <Metric label="Invitados novio" value={stats.groom} />
        <Metric label="Invitados novia" value={stats.bride} />
        <Metric label="Sub invitados" value={stats.companions} />
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
