"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import styles from "./admin.module.css";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className={styles.loginForm}>
      <TextField label="Email" name="email" type="email" autoComplete="email" required />
      <TextField
        label="Contrasena"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
