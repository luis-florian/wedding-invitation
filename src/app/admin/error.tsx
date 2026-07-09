"use client";

import { Button } from "@/components/ui/Button";
import styles from "@/components/admin/admin.module.css";

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className={`${styles.adminShell} ${styles.adminBand}`}>
      <section className={styles.adminCard} style={{ padding: 24 }}>
        <p className={styles.adminMuted}>Algo no salio bien</p>
        <h1>No se pudo completar la accion.</h1>
        <p className={styles.adminMuted}>{error.message || "Revisa la informacion e intenta de nuevo."}</p>
        <Button type="button" onClick={reset} variant="secondary">
          Intentar de nuevo
        </Button>
      </section>
    </main>
  );
}
