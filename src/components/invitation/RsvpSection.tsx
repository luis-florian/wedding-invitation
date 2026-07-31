"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import type { Guest, GuestCompanion, RsvpStatus } from "@/db/schema";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./invitation.module.css";

type RsvpAction = (formData: FormData) => Promise<{ changed: boolean; guestStatus: RsvpStatus }>;

type RsvpSectionProps = {
  action: RsvpAction;
  guest: Guest;
  companions: GuestCompanion[];
};

type Toast = {
  message: string;
  tone: "success" | "error";
};

const answerOptions: Array<{
  status: Exclude<RsvpStatus, "pending">;
  label: string;
  description: string;
  icon: "check" | "x";
}> = [
  {
    status: "confirmed",
    label: "Sí, asistiré",
    description: "Con mucha alegría los acompañaré.",
    icon: "check"
  },
  {
    status: "declined",
    label: "No podré asistir",
    description: "Gracias por avisarnos con tiempo.",
    icon: "x"
  }
];

const invitationStatusLabels: Record<RsvpStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "No asistirá"
};

export function RsvpSection({ action, guest, companions }: RsvpSectionProps) {
  const [statuses, setStatuses] = useState<Record<string, RsvpStatus>>(() => ({
    guestStatus: guest.status,
    ...Object.fromEntries(companions.map((companion) => [`companion:${companion.id}`, companion.status]))
  }));
  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();
  const party = [
    { id: guest.id, label: "Tu asistencia", status: statuses.guestStatus, fieldName: "guestStatus" },
    ...companions.map((companion) => ({
      id: companion.id,
      label: `Acompañante: ${companion.name}`,
      status: statuses[`companion:${companion.id}`],
      fieldName: `companion:${companion.id}`
    }))
  ];

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function selectStatus(fieldName: string, nextStatus: RsvpStatus) {
    const previousStatus = statuses[fieldName];
    if (isPending || previousStatus === nextStatus) return;

    const formData = new FormData();
    formData.set(fieldName, nextStatus);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (!result.changed) return;

        setStatuses((current) => ({ ...current, [fieldName]: nextStatus }));
        setToast({
          message:
            fieldName === "guestStatus" && previousStatus === "pending" && nextStatus === "confirmed"
              ? "Tu asistencia fue confirmada."
              : "Tu respuesta fue actualizada.",
          tone: "success"
        });
      } catch {
        setToast({
          message: "No se pudo guardar tu respuesta. Inténtalo de nuevo.",
          tone: "error"
        });
      }
    });
  }

  return (
    <section className={styles.rsvp} id="rsvp" aria-labelledby="rsvp-title">
      <div className={styles.rsvpHeader}>
        <div>
          <p>Confirmación</p>
          <h2 id="rsvp-title">Hola, {guest.name}</h2>
        </div>
        <StatusBadge status={statuses.guestStatus} label={invitationStatusLabels[statuses.guestStatus]} />
      </div>

      {toast ? (
        <p className={styles.rsvpToast} data-tone={toast.tone} role="status" aria-live="polite">
          {toast.message}
        </p>
      ) : null}

      <p className={styles.rsvpIntro}>
        Nos haría mucha ilusión contar con tu presencia. Selecciona una opción para guardar tu
        respuesta de inmediato.
      </p>

      <div className={styles.rsvpForm} aria-busy={isPending}>
        {party.map((person) => (
          <PersonStatus
            key={person.id}
            label={person.label}
            fieldName={person.fieldName}
            status={person.status}
            disabled={isPending}
            onSelect={selectStatus}
          />
        ))}
      </div>
    </section>
  );
}

function PersonStatus({
  label,
  fieldName,
  status,
  disabled,
  onSelect
}: {
  label: string;
  fieldName: string;
  status: RsvpStatus;
  disabled: boolean;
  onSelect: (fieldName: string, status: RsvpStatus) => void;
}) {
  return (
    <fieldset className={styles.person} disabled={disabled}>
      <legend>{label}</legend>
      <div className={styles.statusOptions}>
        {answerOptions.map((option) => (
          <label className={styles.statusCard} key={option.status}>
            <input
              type="radio"
              name={fieldName}
              value={option.status}
              checked={status === option.status}
              onChange={() => onSelect(fieldName, option.status)}
            />
            <span className={styles.statusCardBody}>
              <span className={styles.statusIcon} aria-hidden="true">
                {option.icon === "check" ? <Check size={18} /> : <X size={18} />}
              </span>
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </span>
          </label>
        ))}
      </div>
      {status !== "pending" ? (
        <button
          type="button"
          className={styles.pendingResponse}
          disabled={disabled}
          onClick={() => onSelect(fieldName, "pending")}
        >
          Dejar respuesta pendiente
        </button>
      ) : null}
    </fieldset>
  );
}
