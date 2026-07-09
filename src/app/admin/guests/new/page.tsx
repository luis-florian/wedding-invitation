import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/Button";
import { CreateGuestForm } from "@/components/admin/GuestForms";
import styles from "@/components/admin/admin.module.css";

export default async function AdminNewGuestPage() {
  const admin = await requireAdmin();

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Nuevo</p>
          <h1>Agregar invitado</h1>
        </div>
        <ButtonLink href="/admin/guests" variant="secondary">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </ButtonLink>
      </div>

      <CreateGuestForm adminSide={admin.side} />
    </main>
  );
}
