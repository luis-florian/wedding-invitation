"use client";

import { Button } from "@/components/ui/Button";

export default function InvitationError({ reset }: { reset: () => void }) {
  return (
    <main className="shell band">
      <section className="card" style={{ padding: 24 }}>
        <p className="muted">No pudimos cargar la invitacion</p>
        <h1>Intenta nuevamente.</h1>
        <p className="muted">Si el problema continua, revisa que el enlace este completo.</p>
        <Button type="button" onClick={reset} variant="secondary">
          Reintentar
        </Button>
      </section>
    </main>
  );
}
