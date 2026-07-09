import { CalendarDays, Clock, MapPin, Navigation } from "lucide-react";
import type { Guest, GuestCompanion, Wedding, WeddingEvent } from "@/db/schema";
import { updateRsvpAction } from "@/app/actions";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { Countdown } from "./Countdown";
import { RsvpSection } from "./RsvpSection";
import styles from "./invitation.module.css";

type InvitationPageProps = {
  wedding: Wedding;
  guest: Guest;
  events: WeddingEvent[];
  companions: GuestCompanion[];
  saved?: boolean;
};

const fallbackHeroImage = "/images/invitation/couple-hero.webp";

export function InvitationPage({
  wedding,
  guest,
  events,
  companions,
  saved = false
}: InvitationPageProps) {
  const action = updateRsvpAction.bind(null, guest.token);
  const heroImageUrl = wedding.heroImageUrl || fallbackHeroImage;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.botanicalTop} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.inviteLabel}>Estas invitado</p>
          <h1>{wedding.coupleNames}</h1>
          <div className={styles.heroDivider} aria-hidden="true" />
          <figure className={styles.photoFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImageUrl} alt={wedding.coupleNames} className={styles.heroImage} />
          </figure>
          <p className={styles.heroDate}>{formatDate(wedding.weddingDate)}</p>
        </div>
      </section>

      <div className={styles.invitationShell}>
        <Countdown targetDate={wedding.weddingDate.toISOString()} />

        <section className={styles.greeting}>
          <p className={styles.eyebrow}>Para {guest.name}</p>
          <h2>Nos encantaria compartir este dia contigo</h2>
          {wedding.introMessage ? <p>{wedding.introMessage}</p> : null}
        </section>

        <section className={styles.events} aria-label="Eventos">
          {events.map((event) => (
            <article className={styles.eventCard} key={event.id}>
              <div className={styles.eventIcon} aria-hidden="true">
                <CalendarDays size={24} />
              </div>
              <p className={styles.eyebrow}>{event.name}</p>
              <h3>{formatEventTime(event.startsAt)}</h3>
              <p className={styles.eventDate}>{formatDate(event.startsAt)}</p>
              {event.endsAt ? (
                <p className={styles.eventMeta}>
                  <Clock size={16} aria-hidden="true" />
                  Finaliza {formatEventTime(event.endsAt)}
                </p>
              ) : null}
              <p className={styles.eventAddress}>
                <MapPin size={17} aria-hidden="true" />
                {event.address}
              </p>
              <div className={styles.eventCopy}>
                {event.description ? <p>{event.description}</p> : null}
                {event.notes ? <p>{event.notes}</p> : null}
              </div>
              {event.googleMapsUrl || event.wazeUrl ? (
                <div className={styles.mapActions}>
                  {event.googleMapsUrl ? (
                    <ButtonLink href={event.googleMapsUrl} target="_blank">
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
              ) : null}
            </article>
          ))}
        </section>

        <RsvpSection
          action={action}
          guest={guest}
          companions={companions}
          saved={saved}
          weddingDate={wedding.weddingDate.toISOString()}
        />

        <section className={styles.farewell}>
          <p>{wedding.finalMessage ?? "Gracias por acompanarnos en este momento tan especial."}</p>
        </section>
      </div>
    </main>
  );
}

function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("es-GT", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Guatemala"
  }).format(date);
}
