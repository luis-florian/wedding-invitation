import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const adminSideEnum = pgEnum("admin_side", ["groom", "bride"]);
export const rsvpStatusEnum = pgEnum("rsvp_status", [
  "pending",
  "confirmed",
  "declined"
]);

export const weddings = pgTable("weddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  coupleNames: text("couple_names").notNull(),
  weddingDate: timestamp("wedding_date", { withTimezone: true }).notNull(),
  heroImageUrl: text("hero_image_url"),
  introMessage: text("intro_message"),
  finalMessage: text("final_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const adminUsers = pgTable(
  "admin_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    side: adminSideEnum("side").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    emailUnique: uniqueIndex("admin_users_email_unique").on(sql`lower(${table.email})`)
  })
);

export const weddingEvents = pgTable(
  "wedding_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    weddingId: uuid("wedding_id")
      .notNull()
      .references(() => weddings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    address: text("address").notNull(),
    description: text("description"),
    notes: text("notes"),
    googleMapsUrl: text("google_maps_url"),
    wazeUrl: text("waze_url"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    weddingOrderIdx: index("wedding_events_wedding_order_idx").on(
      table.weddingId,
      table.sortOrder
    )
  })
);

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    weddingId: uuid("wedding_id")
      .notNull()
      .references(() => weddings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    ownerSide: adminSideEnum("owner_side").notNull(),
    token: text("token").notNull(),
    status: rsvpStatusEnum("status").default("pending").notNull(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    tokenUnique: uniqueIndex("guests_token_unique").on(table.token),
    weddingSideIdx: index("guests_wedding_side_idx").on(table.weddingId, table.ownerSide),
    statusIdx: index("guests_status_idx").on(table.status),
    nameNotEmpty: check("guests_name_not_empty", sql`length(trim(${table.name})) > 0`)
  })
);

export const guestCompanions = pgTable(
  "guest_companions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: rsvpStatusEnum("status").default("pending").notNull(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    guestOrderIdx: index("guest_companions_guest_order_idx").on(
      table.guestId,
      table.sortOrder
    ),
    nameNotEmpty: check(
      "guest_companions_name_not_empty",
      sql`length(trim(${table.name})) > 0`
    )
  })
);

export const weddingsRelations = relations(weddings, ({ many }) => ({
  events: many(weddingEvents),
  guests: many(guests)
}));

export const weddingEventsRelations = relations(weddingEvents, ({ one }) => ({
  wedding: one(weddings, {
    fields: [weddingEvents.weddingId],
    references: [weddings.id]
  })
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  wedding: one(weddings, {
    fields: [guests.weddingId],
    references: [weddings.id]
  }),
  companions: many(guestCompanions)
}));

export const guestCompanionsRelations = relations(guestCompanions, ({ one }) => ({
  guest: one(guests, {
    fields: [guestCompanions.guestId],
    references: [guests.id]
  })
}));

export type AdminSide = (typeof adminSideEnum.enumValues)[number];
export type RsvpStatus = (typeof rsvpStatusEnum.enumValues)[number];
export type Guest = typeof guests.$inferSelect;
export type GuestCompanion = typeof guestCompanions.$inferSelect;
export type Wedding = typeof weddings.$inferSelect;
export type WeddingEvent = typeof weddingEvents.$inferSelect;
