import { AdminNav } from "@/components/admin/AdminNav";
import { getCurrentAdmin } from "@/lib/auth";
import styles from "@/components/admin/admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className={styles.adminRoot}>
      <style>{`
        html,
        body {
          min-height: 100%;
          margin: 0;
          background: #071427;
          color: #f5f8f4;
          font-family: var(--font-sans), Arial, sans-serif;
        }
      `}</style>
      {admin ? <AdminNav admin={admin} /> : null}
      {children}
    </div>
  );
}
