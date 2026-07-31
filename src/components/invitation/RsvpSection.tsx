"use client";

import { useState } from "react";
import { Check, CheckCircle2, X } from "lucide-react";
import type { Guest, GuestCompanion, RsvpStatus } from "@/db/schema";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./invitation.module.css";

type RsvpAction = (formData: FormData) => void | Promise<void>;

type RsvpSectionProps = {
  action: RsvpAction;
  guest: Guest;
  companions: GuestCompanion[];
  saved: boolean;
  weddingDate: string;
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

export function RsvpSection({
  action,
  guest,
  companions,
  saved,
  weddingDate
}: RsvpSectionProps) {
  const hasResponded = saved || guest.status !== "pending";
  const [isEditing, setIsEditing] = useState(!hasResponded);
  const party = [{ id: guest.id, name: guest.name, status: guest.status, fieldName: "guestStatus" }].concat(
    companions.map((companion) => ({
      id: companion.id,
      name: companion.name,
      status: companion.status,
      fieldName: `companion:${companion.id}`
    }))
  );

  return (
    <section className={styles.rsvp} id="rsvp" aria-labelledby="rsvp-title">
      <div className={styles.rsvpHeader}>
        <div>
          <p>Confirmaci&oacute;n</p>
          <h2 id="rsvp-title">Hola, {guest.name}</h2>
        </div>
        <StatusBadge status={guest.status} />
      </div>

      {hasResponded && !isEditing ? (
        <div className={styles.successPanel}>
          <CheckCircle2 size={34} aria-hidden="true" />
          <h3>Confirmaci&oacute;n recibida</h3>
          <p>{successMessage(guest.status, weddingDate)}</p>
          <button type="button" className={styles.changeResponse} onClick={() => setIsEditing(true)}>
            Cambiar respuesta
          </button>
        </div>
      ) : (
        <>
          <p className={styles.rsvpIntro}>
            Nos har&iacute;a mucha ilusi&oacute;n contar con tu presencia. Por favor confirma tu asistencia y
            la de tus acompa&ntilde;antes.
          </p>
          <form action={action} className={styles.rsvpForm}>
            {party.map((person) => (
              <PersonStatus
                key={person.id}
                name={person.name}
                fieldName={person.fieldName}
                defaultStatus={person.status}
              />
            ))}
            <Button type="submit" className={styles.submitButton}>
              Confirmar asistencia
            </Button>
          </form>
        </>
      )}
    </section>
  );
}

function PersonStatus({
  name,
  fieldName,
  defaultStatus
}: {
  name: string;
  fieldName: string;
  defaultStatus: RsvpStatus;
}) {
  return (
    <fieldset className={styles.person}>
      <legend>{name}</legend>
      <div className={styles.statusOptions}>
        {answerOptions.map((option) => (
          <label className={styles.statusCard} key={option.status}>
            <input
              type="radio"
              name={fieldName}
              value={option.status}
              defaultChecked={defaultStatus === option.status}
              required
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
    </fieldset>
  );
}

function successMessage(status: RsvpStatus, weddingDate: string) {
  if (status === "confirmed") {
    return `Muchas gracias. Nos vemos el ${formatShortDate(weddingDate)}.`;
  }

  if (status === "declined") {
    return "Gracias por avisarnos. Te extrañaremos ese día.";
  }

  return "Muchas gracias. Tu respuesta quedó guardada.";
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    timeZone: "America/Guatemala"
  }).format(new Date(date));
}
