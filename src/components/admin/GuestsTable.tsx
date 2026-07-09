import { Pencil } from "lucide-react";
import type { getGuestTableRows } from "@/db/queries/admin";
import type { AdminSide } from "@/db/schema";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buildInvitationUrl } from "@/lib/tokens";
import { sideLabels } from "@/lib/format";
import { canEditSide } from "@/lib/permissions";
import { CopyInviteButton } from "./CopyInviteButton";
import styles from "./admin.module.css";

type GuestTableRow = Awaited<ReturnType<typeof getGuestTableRows>>[number];

export function GuestsTable({
  rows,
  adminSide
}: {
  rows: GuestTableRow[];
  adminSide: AdminSide;
}) {
  if (rows.length === 0) {
    return (
      <div className={styles.panel}>
        <p className="muted">No hay invitados en esta vista.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.guestTable}>
        <thead>
          <tr>
            <th>Persona</th>
            <th>De parte de</th>
            <th>Invitado principal</th>
            <th>Estado</th>
            <th>Link</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const canEdit = canEditSide(adminSide, row.ownerSide);
            const invitationUrl = buildInvitationUrl(row.token);

            return (
              <tr key={`${row.rowType}-${row.id}`}>
                <td data-label="Persona">
                  <strong>{row.name}</strong>
                  {row.rowType === "sub" ? <span>Sub invitado</span> : null}
                </td>
                <td data-label="De parte de">{sideLabels[row.ownerSide]}</td>
                <td data-label="Invitado principal">{row.principalName}</td>
                <td data-label="Estado">
                  <StatusBadge status={row.status} />
                </td>
                <td data-label="Link">
                  {row.rowType === "principal" ? <CopyInviteButton url={invitationUrl} /> : <span className="muted">Mismo link</span>}
                </td>
                <td data-label="Editar">
                  <ButtonLink
                    href={`/admin/guests/${row.guestId}`}
                    variant={canEdit ? "secondary" : "ghost"}
                    title={canEdit ? "Editar invitado" : "Ver invitado"}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    {canEdit ? "Editar" : "Ver"}
                  </ButtonLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
