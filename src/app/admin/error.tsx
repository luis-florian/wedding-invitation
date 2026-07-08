"use client";

import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="shell band">
      <section className="card" style={{ padding: 24 }}>
        <p className="muted">Algo no salio bien</p>
        <h1>No se pudo completar la accion.</h1>
        <p className="muted">{error.message || "Revisa la informacion e intenta de nuevo."}</p>
        <Button type="button" onClick={reset} variant="secondary">
          Intentar de nuevo
        </Button>
      </section>
    </main>
  );
}
