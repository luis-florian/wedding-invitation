import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import type { AdminSession } from "@/lib/auth";
import { sideLabels } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import styles from "./admin.module.css";

export function AdminNav({ admin }: { admin: AdminSession }) {
  return (
    <header className={styles.nav}>
      <div>
        <strong>Wedding RSVP</strong>
        <span>{admin.name} · {sideLabels[admin.side]}</span>
      </div>
      <nav>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/guests">Invitados</Link>
        <Link href="/admin/wedding">Boda</Link>
      </nav>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" title="Cerrar sesion">
          <LogOut size={18} aria-hidden="true" />
          Salir
        </Button>
      </form>
    </header>
  );
}
