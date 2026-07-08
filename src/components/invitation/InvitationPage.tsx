import { CalendarDays, MapPin, Navigation } from "lucide-react";
import type {
  Guest,
  GuestCompanion,
  RsvpStatus,
  Wedding,
  WeddingEvent
} from "@/db/schema";
import { updateRsvpAction } from "@/app/actions";
import { Button, ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime, statusLabels } from "@/lib/format";
import styles from "./invitation.module.css";

type InvitationPageProps = {
  wedding: Wedding;
  guest: Guest;
  events: WeddingEvent[];
  companions: GuestCompanion[];
  saved?: boolean;
};

const statuses: RsvpStatus[] = ["confirmed", "declined", "pending"];

export function InvitationPage({
  wedding,
  guest,
  events,
  companions,
  saved = false
}: InvitationPageProps) {
  const action = updateRsvpAction.bind(null, guest.token);

  return (
    <main>
      <section className={styles.hero}>
        {wedding.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={wedding.heroImageUrl} alt="" className={styles.heroImage} />
        ) : null}
        <div className={styles.heroOverlay}>
          <p>Estas invitado</p>
          <h1>{wedding.coupleNames}</h1>
          <span>{formatDate(wedding.weddingDate)}</span>
        </div>
      </section>

      <div className="shell">
        <section className={styles.greeting}>
          <p className={styles.eyebrow}>Para {guest.name}</p>
          <h2>Nos encantaria compartir este dia contigo.</h2>
          {wedding.introMessage ? <p>{wedding.introMessage}</p> : null}
        </section>

        <section className={`${styles.events} grid two`} aria-label="Eventos">
          {events.map((event) => (
            <article className="card" key={event.id}>
              <div className={styles.eventCard}>
                <CalendarDays aria-hidden="true" />
                <div>
                  <h3>{event.name}</h3>
                  <p>{formatDateTime(event.startsAt)}</p>
                  {event.endsAt ? <p className="muted">Finaliza {formatDateTime(event.endsAt)}</p> : null}
                </div>
                <p>
                  <MapPin aria-hidden="true" />
                  {event.address}
                </p>
                {event.description ? <p>{event.description}</p> : null}
                {event.notes ? <p className="muted">{event.notes}</p> : null}
                <div className={styles.mapActions}>
                  {event.googleMapsUrl ? (
                    <ButtonLink href={event.googleMapsUrl} variant="secondary" target="_blank">
                      <Navigation size={16} aria-hidden="true" />
                      Google Maps
                    </ButtonLink>
                  ) : null}
                  {event.wazeUrl ? (
                    <ButtonLink href={event.wazeUrl} variant="secondary" target="_blank">
                      <Navigation size={16} aria-hidden="true" />
                      Waze
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className={`${styles.rsvp} card`}>
          <div className={styles.rsvpHeader}>
            <div>
              <p className={styles.eyebrow}>Confirmacion</p>
              <h2>Actualiza la asistencia</h2>
            </div>
            <StatusBadge status={guest.status} />
          </div>
          {saved ? (
            <p className={styles.saved}>Gracias. Tu respuesta quedo actualizada.</p>
          ) : null}
          <form action={action} className={styles.rsvpForm}>
            <PersonStatus name={guest.name} fieldName="guestStatus" defaultStatus={guest.status} />
            {companions.map((companion) => (
              <PersonStatus
                key={companion.id}
                name={companion.name}
                fieldName={`companion:${companion.id}`}
                defaultStatus={companion.status}
              />
            ))}
            <Button type="submit">Guardar respuesta</Button>
          </form>
        </section>

        <section className={styles.farewell}>
          <p>{wedding.finalMessage ?? "Gracias por acompanarnos en este momento tan especial."}</p>
        </section>
      </div>
    </main>
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
        {statuses.map((status) => (
          <label key={status}>
            <input
              type="radio"
              name={fieldName}
              value={status}
              defaultChecked={defaultStatus === status}
            />
            <span>{statusLabels[status]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
