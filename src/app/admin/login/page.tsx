import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";
import styles from "@/components/admin/admin.module.css";

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className={styles.loginPage}>
      <section className={`${styles.loginCard} ${styles.adminCard}`}>
        <p className={styles.eyebrow}>Panel administrativo</p>
        <h1>Entrar</h1>
        <p className={styles.adminMuted}>Gestiona invitados, enlaces y confirmaciones.</p>
        <LoginForm />
      </section>
    </main>
  );
}
