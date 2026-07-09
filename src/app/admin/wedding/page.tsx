import { requireAdmin } from "@/lib/auth";
import { getWeddingWithEvents } from "@/db/queries/wedding";
import { updateWeddingAction, updateWeddingEventAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import styles from "@/components/admin/admin.module.css";

export default async function AdminWeddingPage() {
  await requireAdmin();
  const bundle = await getWeddingWithEvents();

  if (!bundle) {
    return (
      <main className={`${styles.adminShell} ${styles.adminPage}`}>
        <section className={styles.panel}>
          <h1>Falta seed inicial</h1>
          <p className={styles.adminMuted}>Ejecuta `npm run db:seed` cuando Neon este configurado.</p>
        </section>
      </main>
    );
  }

  const { wedding, events } = bundle;

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Contenido</p>
          <h1>Boda</h1>
        </div>
      </div>

      <form action={updateWeddingAction} className={`${styles.panel} ${styles.formGrid}`}>
        <TextField label="Nombres" name="coupleNames" defaultValue={wedding.coupleNames} required />
        <TextField
          label="Fecha"
          name="weddingDate"
          type="datetime-local"
          defaultValue={toLocalInput(wedding.weddingDate)}
          required
        />
        <TextField
          label="Foto principal URL"
          name="heroImageUrl"
          defaultValue={wedding.heroImageUrl ?? ""}
        />
        <TextArea
          label="Mensaje inicial"
          name="introMessage"
          defaultValue={wedding.introMessage ?? ""}
        />
        <TextArea
          label="Mensaje final"
          name="finalMessage"
          defaultValue={wedding.finalMessage ?? ""}
        />
        <Button type="submit">Guardar boda</Button>
      </form>

      <section className={`${styles.adminGrid} ${styles.gridTwo}`} style={{ marginTop: 16 }}>
        {events.map((event) => (
          <form action={updateWeddingEventAction} className={`${styles.panel} ${styles.formGrid}`} key={event.id}>
            <input type="hidden" name="id" value={event.id} />
            <TextField label="Evento" name="name" defaultValue={event.name} required />
            <TextField
              label="Inicio"
              name="startsAt"
              type="datetime-local"
              defaultValue={toLocalInput(event.startsAt)}
              required
            />
            <TextField
              label="Fin"
              name="endsAt"
              type="datetime-local"
              defaultValue={event.endsAt ? toLocalInput(event.endsAt) : ""}
            />
            <TextField label="Direccion" name="address" defaultValue={event.address} required />
            <TextArea label="Descripcion" name="description" defaultValue={event.description ?? ""} />
            <TextArea label="Notas" name="notes" defaultValue={event.notes ?? ""} />
            <TextField label="Google Maps" name="googleMapsUrl" defaultValue={event.googleMapsUrl ?? ""} />
            <TextField label="Waze" name="wazeUrl" defaultValue={event.wazeUrl ?? ""} />
            <Button type="submit" variant="secondary">Guardar evento</Button>
          </form>
        ))}
      </section>
    </main>
  );
}

function toLocalInput(date: Date) {
  return date.toISOString().slice(0, 16);
}
