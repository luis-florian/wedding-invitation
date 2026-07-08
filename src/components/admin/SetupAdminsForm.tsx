"use client";

import { useActionState } from "react";
import { setupAdminsAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import styles from "./admin.module.css";

export function SetupAdminsForm() {
  const [error, formAction, pending] = useActionState(setupAdminsAction, null);

  return (
    <form action={formAction} className={styles.loginForm}>
      <TextField label="Clave de setup" name="setupSecret" type="password" required />

      <div className={styles.setupColumns}>
        <section className={styles.panel}>
          <p className={styles.eyebrow}>Admin novio</p>
          <TextField label="Nombre" name="groomName" defaultValue="Novio" required />
          <TextField label="Email" name="groomEmail" type="email" required />
          <TextField label="Contrasena" name="groomPassword" type="password" required />
        </section>

        <section className={styles.panel}>
          <p className={styles.eyebrow}>Admin novia</p>
          <TextField label="Nombre" name="brideName" defaultValue="Novia" required />
          <TextField label="Email" name="brideEmail" type="email" required />
          <TextField label="Contrasena" name="bridePassword" type="password" required />
        </section>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creando..." : "Crear o actualizar admins"}
      </Button>
    </form>
  );
}
