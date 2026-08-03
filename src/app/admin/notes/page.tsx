import { Save } from "lucide-react";
import { updateAdminNoteAction } from "@/app/actions";
import { getAdminNotes } from "@/db/queries/notes";
import { requireAdmin } from "@/lib/auth";
import type { AdminNote, AdminSide } from "@/db/schema";
import { sideLabels } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import styles from "@/components/admin/admin.module.css";

const sides: AdminSide[] = ["groom", "bride"];

export default async function AdminNotesPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [admin, notes, query] = await Promise.all([requireAdmin(), getAdminNotes(), searchParams]);
  const noteBySide = new Map(notes.map((note) => [note.side, note]));

  return (
    <main className={`${styles.adminShell} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Privado admin</p>
          <h1>Notas</h1>
        </div>
      </div>

      {query.saved === "note" ? (
        <p className={styles.successMessage} role="status">
          Nota guardada.
        </p>
      ) : null}

      <section className={`${styles.adminGrid} ${styles.gridTwo}`}>
        {sides.map((side) => (
          <NotePanel
            key={side}
            side={side}
            note={noteBySide.get(side) ?? null}
            canEdit={admin.side === side}
          />
        ))}
      </section>
    </main>
  );
}

function NotePanel({
  side,
  note,
  canEdit
}: {
  side: AdminSide;
  note: AdminNote | null;
  canEdit: boolean;
}) {
  const title = `Notas ${sideLabels[side].toLowerCase()}`;
  const body = note?.body ?? "";

  return (
    <article className={`${styles.panel} ${styles.notePanel}`}>
      <div>
        <p className={styles.eyebrow}>{canEdit ? "Editable" : "Solo lectura"}</p>
        <h2>{title}</h2>
      </div>

      {canEdit ? (
        <form action={updateAdminNoteAction} className={styles.formGrid}>
          <input type="hidden" name="side" value={side} />
          <TextArea label={title} name="body" defaultValue={body} />
          <Button type="submit">
            <Save size={16} aria-hidden="true" />
            Guardar nota
          </Button>
        </form>
      ) : (
        <p className={body ? styles.noteRead : styles.adminMuted}>
          {body || "Sin notas todavia."}
        </p>
      )}
    </article>
  );
}
