import { Lock, Plus, Trash2 } from "lucide-react";
import {
  createCompanionAction,
  createGuestAction,
  deleteCompanionAction,
  deleteGuestAction,
  updateCompanionAction,
  updateGuestAction
} from "@/app/actions";
import type { AdminSide, GuestCompanion, RsvpStatus } from "@/db/schema";
import type { getGuestRows } from "@/db/queries/admin";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildInvitationUrl } from "@/lib/tokens";
import { sideLabels, statusLabels } from "@/lib/format";
import { canEditSide } from "@/lib/permissions";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { CopyInviteButton } from "./CopyInviteButton";
import styles from "./admin.module.css";

type GuestRow = Awaited<ReturnType<typeof getGuestRows>>[number];

const statuses: RsvpStatus[] = ["pending", "confirmed", "declined"];

export function CreateGuestForm({ adminSide }: { adminSide: AdminSide }) {
  return (
    <form action={createGuestAction} className={`${styles.panel} ${styles.formGrid}`}>
      <input type="hidden" name="ownerSide" value={adminSide} />
      <input type="hidden" name="status" value="pending" />
      <TextField label="Nombre" name="name" required />
      <TextField label="Telefono" name="phone" />
      <Button type="submit">
        <Plus size={16} aria-hidden="true" />
        Crear invitado {sideLabels[adminSide].toLowerCase()}
      </Button>
    </form>
  );
}

export function GuestCard({ guest, adminSide }: { guest: GuestRow; adminSide: AdminSide }) {
  const canEdit = canEditSide(adminSide, guest.ownerSide);
  const invitationUrl = buildInvitationUrl(guest.token);

  return (
    <article className={styles.guestCard}>
      <div className={styles.guestTop}>
        <div>
          <p className={styles.eyebrow}>{sideLabels[guest.ownerSide]}</p>
          <h3>{guest.name}</h3>
          <p className="muted">{guest.phone || "Sin telefono"}</p>
        </div>
        <StatusBadge status={guest.status} />
      </div>

      <div className={styles.copyRow}>
        <code>{invitationUrl}</code>
        <div className={styles.copyActions}>
          <CopyInviteButton url={invitationUrl} />
          <ButtonLink href={invitationUrl} target="_blank" variant="secondary">
            Abrir
          </ButtonLink>
        </div>
      </div>

      {canEdit ? (
        <form action={updateGuestAction} className={styles.inlineForm}>
          <input type="hidden" name="id" value={guest.id} />
          <input type="hidden" name="ownerSide" value={guest.ownerSide} />
          <TextField label="Nombre" name="name" defaultValue={guest.name} required />
          <TextField label="Telefono" name="phone" defaultValue={guest.phone ?? ""} />
          <StatusSelect name="status" defaultValue={guest.status} />
          <Button type="submit" variant="secondary">Guardar</Button>
        </form>
      ) : (
        <div className={styles.locked}>
          <Lock size={16} aria-hidden="true" />
          Solo lectura para tu usuario.
        </div>
      )}

      <div className={styles.companions}>
        <h4>Sub invitados</h4>
        {guest.companions.length === 0 ? <p className="muted">Sin sub invitados.</p> : null}
        {guest.companions.map((companion) => (
          <CompanionRow
            key={companion.id}
            companion={companion}
            canEdit={canEdit}
          />
        ))}
        {canEdit ? (
          <form action={createCompanionAction} className={styles.inlineForm}>
            <input type="hidden" name="guestId" value={guest.id} />
            <input type="hidden" name="status" value="pending" />
            <TextField label="Nombre sub invitado" name="name" required />
            <Button type="submit" variant="secondary">Agregar</Button>
          </form>
        ) : null}
      </div>

      {canEdit ? (
        <form action={deleteGuestAction}>
          <input type="hidden" name="id" value={guest.id} />
          <ConfirmSubmitButton
            type="submit"
            variant="danger"
            message={`Eliminar a ${guest.name} y sus sub invitados?`}
          >
            <Trash2 size={16} aria-hidden="true" />
            Eliminar invitado
          </ConfirmSubmitButton>
        </form>
      ) : null}
    </article>
  );
}

function CompanionRow({
  companion,
  canEdit
}: {
  companion: GuestCompanion;
  canEdit: boolean;
}) {
  if (!canEdit) {
    return (
      <div className={styles.companionRead}>
        <span>{companion.name}</span>
        <StatusBadge status={companion.status} />
      </div>
    );
  }

  return (
    <form action={updateCompanionAction} className={styles.inlineForm}>
      <input type="hidden" name="id" value={companion.id} />
      <TextField label="Nombre" name="name" defaultValue={companion.name} required />
      <StatusSelect name="status" defaultValue={companion.status} />
      <Button type="submit" variant="secondary">Guardar</Button>
      <ConfirmSubmitButton
        formAction={deleteCompanionAction}
        type="submit"
        variant="ghost"
        message={`Eliminar a ${companion.name}?`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </ConfirmSubmitButton>
    </form>
  );
}

function StatusSelect({ name, defaultValue }: { name: string; defaultValue: RsvpStatus }) {
  return (
    <SelectField label="Estado" name={name} defaultValue={defaultValue}>
      {statuses.map((status) => (
        <option value={status} key={status}>
          {statusLabels[status]}
        </option>
      ))}
    </SelectField>
  );
}
