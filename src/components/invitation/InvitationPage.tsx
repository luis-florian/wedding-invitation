import Image from "next/image";
import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  Heart,
  MapPin,
  Navigation
} from "lucide-react";
import type { Guest, GuestCompanion, Wedding, WeddingEvent } from "@/db/schema";
import { updateRsvpAction } from "@/app/actions";
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

const weddingDateIso = "2026-10-10T15:00:00-06:00";

export function InvitationPage({
  guest,
  events,
  companions,
  saved = false
}: InvitationPageProps) {
  const action = updateRsvpAction.bind(null, guest.token);
  const ceremonyLinks = getMapLinks(events[0]);
  const receptionLinks = getMapLinks(events[1]);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="invitation-title">
        <div className={styles.heroContent}>
          <h1 id="invitation-title" className={styles.heroNames}>
            <span>Nathaly</span>
            <span className={styles.heroAmp}>&amp;</span>
            <span>Luis</span>
          </h1>
          <p>&iexcl;Se casan!</p>
        </div>
        <div className={styles.heroMeta} aria-hidden="true">
          <span>Octubre 10 2026, 3:00 PM</span>
          <span>Antigua Guatemala</span>
        </div>
      </section>

      <section className={styles.storyNav} aria-label="Secciones de la invitaci&oacute;n">
        <nav className={styles.navLinks}>
          <NavCard href="#love-story" icon={<Heart size={28} aria-hidden="true" />}>
            Love story
          </NavCard>
          <NavCard href="#venue" icon={<MapPin size={32} aria-hidden="true" />}>
            Historia &amp; Ubicaci&oacute;n
          </NavCard>
          <NavCard href="#detalles" icon={<BookOpen size={30} aria-hidden="true" />}>
            Detalles
          </NavCard>
          <NavCard href="#rsvp" icon={<CalendarCheck size={30} aria-hidden="true" />}>
            Confirmaci&oacute;n
          </NavCard>
        </nav>
      </section>

      <section className={styles.story} id="love-story">
        <div className={styles.textBlock}>
          <p>Todo comenz&oacute; en la Ciudad de Guatemala...</p>
          <p>
            Durante cuatro a&ntilde;os, nuestros caminos estuvieron m&aacute;s cerca de lo que imaginamos:
            fuimos vecinos, compartimos el mismo colegio, vivimos en la misma ciudad... pero en
            el momento exacto en que nuestras historias pudieron encontrarse, la vida nos llev&oacute;
            por rumbos distintos, Nathaly regres&oacute; a Honduras, Luis Fernando en Guatemala. Pero,
            sin saberlo, Dios ya estaba entrelazando nuestras historias.
          </p>
          <p>
            A&ntilde;os despu&eacute;s, nuestros caminos volvieron a cruzarse. Lo que inici&oacute; con una
            conversaci&oacute;n se convirti&oacute; en un v&iacute;nculo imposible de detener; palabras que
            encontraron su lugar, risas que se volvieron recuerdos y un amor que creci&oacute; con la
            certeza de que no era casualidad.
          </p>
          <p>
            <strong>Hoy creemos que nuestra historia fue escrita por la mano de Dios:</strong> con
            un comienzo inesperado, cap&iacute;tulos llenos de aventura, felicidad y un amor vibrante,
            sellado con una promesa para toda la vida.
          </p>
        </div>
      </section>

      <section className={styles.vow}>
        <p>
          Y ahora, con mucha ilusi&oacute;n y alegr&iacute;a queremos hacerte parte del sublime momento en el
          que rodeados del amor de Dios y nuestros seres queridos, uniremos nuestras vidas para
          siempre.
        </p>
        <Image
          src="/images/invitation/redesign/logo-boda.svg"
          alt=""
          width={140}
          height={86}
          className={styles.vowLogo}
          aria-hidden="true"
        />
      </section>

      <section className={styles.datePanel} aria-label="Fecha de la boda">
        <p>S&aacute;bado</p>
        <strong>10</strong>
        <p>Octubre</p>
        <span>2026</span>
      </section>

      <section className={styles.venueSection} id="venue" aria-label="Historia y ubicaci&oacute;n">
        <EventPanel
          title="Ceremonia y boda civil"
          place="Ruinas del convento e iglesia La Recolección"
          description="Las ruinas de La Recolección son uno de los monumentos históricos más emblemáticos de Antigua Guatemala. Construidas en el siglo XVIII como convento de la Orden de los Recoletos, representan el esplendor de la arquitectura barroca colonial. Aunque fueron gravemente afectadas por los terremotos de 1773, sus imponentes restos se conservan como símbolo de historia, resiliencia y legado cultural."
          schedule={[
            ["02:00 PM", "Recibimiento y recorrido libre"],
            ["03:00 PM", "Boda civil"],
            ["04:00 PM", "Ceremonia"],
            ["05:00 PM", "Fotografías y traslado a recepción"]
          ]}
          links={ceremonyLinks}
        />
        <EventPanel
          title="Recepción y celebración"
          place="Verdeeventos, Jardín No. 2"
          description="Verdeeventos se encuentra en el corazón de Antigua Guatemala, ciudad reconocida como Patrimonio Mundial de la Humanidad por la UNESCO. Sus jardines se ubican justo frente a las majestuosas Ruinas de La Recolección. En este lugar se unen la naturaleza, la historia y la arquitectura antigua, permitiendo apreciar no solo la celebración, sino también la esencia de una ciudad que guarda siglos de tradición y belleza."
          schedule={[
            ["05:45 PM", "Cóctel de bienvenida"],
            ["06:10 PM", "Entrada de los novios"],
            ["06:30 PM", "Cena"],
            ["07:15 PM", "Fiesta"],
            ["11:00 PM", "¡Fin e inicio de una nueva familia!"]
          ]}
          links={receptionLinks}
          variant="light"
        />
      </section>

      <section className={styles.details} id="detalles">
        <h2>Detalles</h2>
        <div className={styles.detailGrid}>
          <DetailItem visual={<DressCodeVisual />} title="Código de vestimenta">
            <p>Formal, favor evitar color blanco.</p>
          </DetailItem>
          <DetailItem
            visual={
              <Image
                src="/images/invitation/redesign/telefono.png"
                alt=""
                width={755}
                height={800}
                aria-hidden="true"
              />
            }
            title="Contactos"
          >
            <ul>
              <li>Luis Florian: +502 56301380</li>
              <li>Nathaly Pilo&ntilde;a: +504 97962423</li>
              <li>Macheri Quan (Wedding planner): +502 50501312</li>
            </ul>
          </DetailItem>
          <DetailItem
            visual={
              <Image
                src="/images/invitation/redesign/regalo.png"
                alt=""
                width={800}
                height={548}
                aria-hidden="true"
              />
            }
            title="Regalos"
          >
            <p>
              Lo m&aacute;s lindo, amado y caro que nos pueden obsequiar es el tiempo compartido y las
              memorias creadas juntos.
            </p>
          </DetailItem>
        </div>
        <p className={styles.giftNote}>
          Pero, si desean regalarnos algo m&aacute;s, preferimos que sea en efectivo.
        </p>
        <p className={styles.giftNote}>Cada regalito ser&aacute; para equipar nuestro nuevo hogar &#9825;</p>
      </section>

      <section className={styles.rsvpPrompt} aria-label="Ir a confirmaci&oacute;n">
        <div>
          <p>Necesitamos tu confirmaci&oacute;n</p>
        </div>
      </section>

      <RsvpSection
        action={action}
        guest={guest}
        companions={companions}
        saved={saved}
        weddingDate={weddingDateIso}
      />

      <Countdown targetDate={weddingDateIso} />

      <section className={styles.farewell}>
        <p>&iexcl;Ser&aacute; un honor vivir este momento juntos!</p>
        <div className={styles.seal} aria-hidden="true">
          <Image
            src="/images/invitation/redesign/sello.png"
            alt=""
            width={420}
            height={409}
            className={styles.sealImage}
          />
          <Image
            src="/images/invitation/redesign/logo-boda.svg"
            alt=""
            width={74}
            height={46}
            className={styles.sealLogo}
          />
        </div>
      </section>
    </main>
  );
}

type MapLinks = {
  googleMapsUrl?: string | null;
  wazeUrl?: string | null;
};

function getMapLinks(event?: WeddingEvent): MapLinks {
  return {
    googleMapsUrl: event?.googleMapsUrl,
    wazeUrl: event?.wazeUrl
  };
}

function NavCard({
  href,
  icon,
  children
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={styles.navCard}>
      <span className={styles.navIcon}>{icon}</span>
      <span className={styles.navText}>{children}</span>
      <ChevronRight size={24} aria-hidden="true" className={styles.navArrow} />
    </a>
  );
}

function EventPanel({
  title,
  place,
  description,
  schedule,
  links,
  variant = "dark"
}: {
  title: string;
  place: string;
  description: string;
  schedule: Array<[string, string]>;
  links: MapLinks;
  variant?: "dark" | "light";
}) {
  return (
    <article className={[styles.eventPanel, styles[variant]].join(" ")}>
      <div className={styles.eventContent}>
        <h2>{title}</h2>
        <p className={styles.place}>{place}</p>
        <p>{description}</p>
        <dl className={styles.timeline}>
          {schedule.map(([time, label]) => (
            <div key={`${time}-${label}`}>
              <dt>{time}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <MapActions links={links} />
    </article>
  );
}

function MapActions({ links }: { links: MapLinks }) {
  if (!links.googleMapsUrl && !links.wazeUrl) return null;

  return (
    <div className={styles.mapActions}>
      {links.googleMapsUrl ? (
        <a href={links.googleMapsUrl} target="_blank" rel="noreferrer">
          Google Maps
          <MapPin size={24} aria-hidden="true" />
        </a>
      ) : null}
      {links.wazeUrl ? (
        <a href={links.wazeUrl} target="_blank" rel="noreferrer">
          Waze
          <Navigation size={22} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

function DetailItem({
  visual,
  title,
  children
}: {
  visual: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className={styles.detailItem}>
      <div className={styles.detailVisual}>{visual}</div>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

function DressCodeVisual() {
  return (
    <div className={styles.dressVisual} aria-hidden="true">
      <Image
        src="/images/invitation/redesign/mujer1.png"
        alt=""
        width={386}
        height={798}
        className={styles.dressWomanOne}
      />
      <Image
        src="/images/invitation/redesign/mujer2.png"
        alt=""
        width={457}
        height={799}
        className={styles.dressWomanTwo}
      />
    </div>
  );
}
