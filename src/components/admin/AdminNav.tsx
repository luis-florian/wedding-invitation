import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/app/actions";
import type { AdminSession } from "@/lib/auth";
import { sideLabels } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import styles from "./admin.module.css";

export function AdminNav({ admin }: { admin: AdminSession }) {
  return (
    <header className={styles.nav}>
      <div className={styles.navBrand}>
        <strong>Wedding</strong>
        <span>{admin.name} · {sideLabels[admin.side]}</span>
      </div>
      <nav className={styles.desktopNav} aria-label="Administracion">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/guests">Invitados</Link>
        <Link href="/admin/wedding">Boda</Link>
      </nav>
      <form action={logoutAction} className={styles.desktopLogout}>
        <Button type="submit" variant="ghost" title="Cerrar sesion">
          <LogOut size={18} aria-hidden="true" />
          Salir
        </Button>
      </form>
      <details className={styles.navMenu}>
        <summary aria-label="Abrir menu" role="button">
          <Menu size={20} aria-hidden="true" />
        </summary>
        <div className={styles.navPanel}>
          <nav aria-label="Administracion">
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
        </div>
      </details>
    </header>
  );
}
