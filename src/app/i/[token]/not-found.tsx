import { ButtonLink } from "@/components/ui/Button";

export default function InvitationNotFound() {
  return (
    <main className="shell band">
      <section className="card" style={{ padding: 24 }}>
        <p className="muted">Invitacion no encontrada</p>
        <h1>Este enlace no parece estar activo.</h1>
        <p className="muted">Revisa que hayas abierto el enlace completo que recibiste por WhatsApp.</p>
        <ButtonLink href="/" variant="secondary">Volver</ButtonLink>
      </section>
    </main>
  );
}
