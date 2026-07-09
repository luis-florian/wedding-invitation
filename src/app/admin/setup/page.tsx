import { SetupAdminsForm } from "@/components/admin/SetupAdminsForm";
import styles from "@/components/admin/admin.module.css";

export default function AdminSetupPage() {
  const enabled = Boolean(process.env.SETUP_SECRET);

  return (
    <main className={`${styles.adminShell} ${styles.adminBand}`}>
      <section className={`${styles.panel} ${styles.adminStack}`}>
        <div>
          <p className={styles.eyebrow}>Setup temporal</p>
          <h1>Crear administradores</h1>
          <p className={styles.adminMuted}>
            Esta pantalla crea o actualiza los dos accesos necesarios. Para deshabilitarla,
            elimina `SETUP_SECRET` de las variables de entorno despues de usarla.
          </p>
        </div>
        {enabled ? (
          <SetupAdminsForm />
        ) : (
          <p className={styles.error}>
            Setup deshabilitado. Define `SETUP_SECRET` en `.env` para activar esta pantalla.
          </p>
        )}
      </section>
    </main>
  );
}
