import { AdminNav } from "@/components/admin/AdminNav";
import { getCurrentAdmin } from "@/lib/auth";
import styles from "@/components/admin/admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className={styles.adminRoot}>
      {admin ? <AdminNav admin={admin} /> : null}
      {children}
    </div>
  );
}
