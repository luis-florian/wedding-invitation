import { ArrowLeft, Trash2 } from "lucide-react";
import {
  convertGuestToCompanionAction,
  createCompanionAction,
  deleteCompanionAction,
  deleteGuestAction,
  updateCompanionAction,
  updateGuestAction
} from "@/app/actions";
import type { getGuestById } from "@/db/queries/admin";
import type { AdminSide, RsvpStatus } from "@/db/schema";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildInvitationUrl } from "@/lib/tokens";
import { sideLabels, statusLabels } from "@/lib/format";
import { canEditSide } from "@/lib/permissions";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { CopyInviteButton } from "./CopyInviteButton";
import styles from "./admin.module.css";

type GuestDetail = NonNullable<Awaited<ReturnType<typeof getGuestById>>>;
type AssignableGuest = Pick<GuestDetail, "id" | "name" | "status">;

const statuses: RsvpStatus[] = ["pending", "confirmed", "declined"];

export function GuestEditor({
  guest,
  adminSide,
  assignableGuests
}: {
  guest: GuestDetail;
  adminSide: AdminSide;
  assignableGuests: AssignableGuest[];
}) {
  const canEdit = canEditSide(adminSide, guest.ownerSide);
  const invitationUrl = buildInvitationUrl(guest.token);

  return (
    <div className="stack">
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{sideLabels[guest.ownerSide]}</p>
          <h1>{guest.name}</h1>
        </div>
        <ButtonLink href="/admin/guests" variant="secondary">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </ButtonLink>
      </div>

      <section className={`${styles.panel} ${styles.editSummary}`}>
        <div>
          <span className="muted">Estado actual</span>
          <StatusBadge status={guest.status} />
        </div>
        <div>
          <span className="muted">Link de invitacion</span>
          <code>{invitationUrl}</code>
        </div>
        <div className={styles.copyActions}>
          <CopyInviteButton url={invitationUrl} />
          <ButtonLink href={invitationUrl} target="_blank" variant="secondary">
            Abrir invitacion
          </ButtonLink>
        </div>
      </section>

      {!canEdit ? (
        <section className={styles.panel}>
          <p className="muted">
            Este invitado pertenece al lado {sideLabels[guest.ownerSide].toLowerCase()}. Puedes verlo,
            pero no editarlo con tu usuario.
          </p>
        </section>
      ) : null}

      <section className={styles.panel}>
        <h2>Invitado principal</h2>
        <form action={updateGuestAction} className={styles.formGrid}>
          <input type="hidden" name="id" value={guest.id} />
          <input type="hidden" name="ownerSide" value={guest.ownerSide} />
          <TextField label="Nombre" name="name" defaultValue={guest.name} required disabled={!canEdit} />
          <StatusSelect name="status" defaultValue={guest.status} disabled={!canEdit} />
          {canEdit ? <Button type="submit">Guardar invitado</Button> : null}
        </form>
      </section>

      <section className={styles.panel}>
        <h2>Sub invitados</h2>
        <div className="stack">
          {guest.companions.length === 0 ? <p className="muted">Sin sub invitados.</p> : null}
          {guest.companions.map((companion) => (
            <form action={updateCompanionAction} className={styles.inlineForm} key={companion.id}>
              <input type="hidden" name="id" value={companion.id} />
              <TextField
                label="Nombre"
                name="name"
                defaultValue={companion.name}
                required
                disabled={!canEdit}
              />
              <StatusSelect name="status" defaultValue={companion.status} disabled={!canEdit} />
              {canEdit ? (
                <>
                  <Button type="submit" variant="secondary">Guardar</Button>
                  <ConfirmSubmitButton
                    formAction={deleteCompanionAction}
                    type="submit"
                    variant="ghost"
                    message={`Eliminar a ${companion.name}?`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </ConfirmSubmitButton>
                </>
              ) : null}
            </form>
          ))}

          {canEdit ? (
            <form action={createCompanionAction} className={styles.inlineForm}>
              <input type="hidden" name="guestId" value={guest.id} />
              <input type="hidden" name="status" value="pending" />
              <TextField label="Nuevo sub invitado" name="name" required />
              <Button type="submit" variant="secondary">Agregar sub invitado</Button>
            </form>
          ) : null}
        </div>
      </section>

      {canEdit ? (
        <section className={styles.panel}>
          <h2>Asignar invitado existente</h2>
          <form action={convertGuestToCompanionAction} className={styles.inlineForm}>
            <input type="hidden" name="targetGuestId" value={guest.id} />
            <SelectField label="Invitado" name="sourceGuestId" required>
              <option value="">Selecciona un invitado</option>
              {assignableGuests.map((candidate) => (
                <option value={candidate.id} key={candidate.id}>
                  {candidate.name} · {statusLabels[candidate.status]}
                </option>
              ))}
            </SelectField>
            <Button type="submit" variant="secondary" disabled={assignableGuests.length === 0}>
              Convertir en sub invitado
            </Button>
          </form>
          {assignableGuests.length === 0 ? (
            <p className="muted">No hay invitados disponibles para convertir.</p>
          ) : null}
        </section>
      ) : null}

      {canEdit ? (
        <section className={styles.panel}>
          <form action={deleteGuestAction}>
            <input type="hidden" name="id" value={guest.id} />
            <ConfirmSubmitButton
              type="submit"
              variant="danger"
              message={`Eliminar a ${guest.name} y todos sus sub invitados?`}
            >
              <Trash2 size={16} aria-hidden="true" />
              Eliminar invitado principal
            </ConfirmSubmitButton>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function StatusSelect({
  name,
  defaultValue,
  disabled = false
}: {
  name: string;
  defaultValue: RsvpStatus;
  disabled?: boolean;
}) {
  return (
    <SelectField label="Estado" name={name} defaultValue={defaultValue} disabled={disabled}>
      {statuses.map((status) => (
        <option value={status} key={status}>
          {statusLabels[status]}
        </option>
      ))}
    </SelectField>
  );
}
