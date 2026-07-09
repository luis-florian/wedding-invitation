"use server";

import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  adminUsers,
  guestCompanions,
  guests,
  weddingEvents,
  weddings,
  type RsvpStatus
} from "@/db/schema";
import { getMainWedding, getWeddingWithEvents } from "@/db/queries/wedding";
import { createAdminSession, clearAdminSession, requireAdmin } from "@/lib/auth";
import { createGuestToken } from "@/lib/tokens";
import {
  companionFormSchema,
  guestFormSchema,
  loginSchema,
  setupAdminsSchema,
  rsvpStatusSchema,
  weddingEventFormSchema,
  weddingFormSchema
} from "@/lib/validation";

function nullable(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? null : text;
}

function statusFromForm(value: FormDataEntryValue | null): RsvpStatus {
  return rsvpStatusSchema.parse(value);
}

export async function loginAction(_prevState: string | null, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) return "Revisa el email y la contrasena.";

  const ok = await createAdminSession(parsed.data.email, parsed.data.password);
  if (!ok) return "Credenciales invalidas.";

  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function setupAdminsAction(_prevState: string | null, formData: FormData) {
  const setupSecret = process.env.SETUP_SECRET;

  if (!setupSecret) {
    return "La pagina de setup esta deshabilitada. Define SETUP_SECRET en .env para usarla.";
  }

  const parsed = setupAdminsSchema.safeParse({
    setupSecret: formData.get("setupSecret"),
    groomName: formData.get("groomName"),
    groomEmail: formData.get("groomEmail"),
    groomPassword: formData.get("groomPassword"),
    brideName: formData.get("brideName"),
    brideEmail: formData.get("brideEmail"),
    bridePassword: formData.get("bridePassword")
  });

  if (!parsed.success) {
    return "Revisa los datos. Los emails deben ser validos y las contrasenas tener al menos 8 caracteres.";
  }

  if (parsed.data.setupSecret !== setupSecret) {
    return "La clave de setup no coincide.";
  }

  const db = getDb();
  await upsertAdmin({
    email: parsed.data.groomEmail,
    name: parsed.data.groomName,
    password: parsed.data.groomPassword,
    side: "groom"
  });
  await upsertAdmin({
    email: parsed.data.brideEmail,
    name: parsed.data.brideName,
    password: parsed.data.bridePassword,
    side: "bride"
  });

  async function upsertAdmin(input: {
    email: string;
    name: string;
    password: string;
    side: "groom" | "bride";
  }) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(sql`lower(${adminUsers.email}) = ${normalizedEmail}`)
      .limit(1);

    const values = {
      email: normalizedEmail,
      name: input.name,
      passwordHash: await bcrypt.hash(input.password, 12),
      side: input.side,
      updatedAt: new Date()
    };

    if (existing) {
      await db.update(adminUsers).set(values).where(eq(adminUsers.id, existing.id));
      return;
    }

    await db.insert(adminUsers).values(values);
  }

  redirect("/admin/login?setup=created");
}

export async function updateRsvpAction(token: string, formData: FormData) {
  const db = getDb();
  const [guest] = await db.select().from(guests).where(eq(guests.token, token)).limit(1);
  if (!guest) redirect(`/i/${token}?error=not-found`);

  const now = new Date();
  await db
    .update(guests)
    .set({
      status: statusFromForm(formData.get("guestStatus")),
      respondedAt: now,
      updatedAt: now
    })
    .where(eq(guests.id, guest.id));

  const companions = await db
    .select({ id: guestCompanions.id })
    .from(guestCompanions)
    .where(eq(guestCompanions.guestId, guest.id));

  for (const companion of companions) {
    const value = formData.get(`companion:${companion.id}`);
    if (!value) continue;
    await db
      .update(guestCompanions)
      .set({
        status: statusFromForm(value),
        respondedAt: now,
        updatedAt: now
      })
      .where(and(eq(guestCompanions.id, companion.id), eq(guestCompanions.guestId, guest.id)));
  }

  revalidatePath(`/i/${token}`);
  revalidatePath("/admin");
  redirect(`/i/${token}?saved=1`);
}

export async function createGuestAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const wedding = await getMainWedding();
  if (!wedding) throw new Error("No wedding has been seeded");

  const parsed = guestFormSchema.parse({
    name: formData.get("name"),
    phone: nullable(formData.get("phone")) ?? undefined,
    ownerSide: formData.get("ownerSide"),
    status: formData.get("status") ?? "pending"
  });

  if (parsed.ownerSide !== admin.side) {
    throw new Error("No puedes crear invitados del otro lado");
  }

  await db.insert(guests).values({
    weddingId: wedding.id,
    name: parsed.name,
    phone: parsed.phone || null,
    ownerSide: parsed.ownerSide,
    status: parsed.status,
    respondedAt: parsed.status === "pending" ? null : new Date(),
    token: createGuestToken()
  });

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
}

export async function updateGuestAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id"));
  const parsed = guestFormSchema.parse({
    id,
    name: formData.get("name"),
    phone: nullable(formData.get("phone")) ?? undefined,
    ownerSide: formData.get("ownerSide"),
    status: formData.get("status")
  });

  const [guest] = await db.select().from(guests).where(eq(guests.id, id)).limit(1);
  if (!guest || guest.ownerSide !== admin.side || parsed.ownerSide !== admin.side) {
    throw new Error("No puedes editar este invitado");
  }

  await db
    .update(guests)
    .set({
      name: parsed.name,
      phone: parsed.phone || null,
      status: parsed.status,
      respondedAt: parsed.status === "pending" ? null : new Date(),
      updatedAt: new Date()
    })
    .where(eq(guests.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${id}`);
  revalidatePath(`/i/${guest.token}`);
}

export async function deleteGuestAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id"));
  const [guest] = await db.select().from(guests).where(eq(guests.id, id)).limit(1);

  if (!guest || guest.ownerSide !== admin.side) {
    throw new Error("No puedes eliminar este invitado");
  }

  await db.delete(guests).where(eq(guests.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  redirect("/admin/guests");
}

export async function createCompanionAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const guestId = String(formData.get("guestId"));
  const parsed = companionFormSchema.parse({
    name: formData.get("name"),
    status: formData.get("status") ?? "pending"
  });

  const [guest] = await db.select().from(guests).where(eq(guests.id, guestId)).limit(1);
  if (!guest || guest.ownerSide !== admin.side) {
    throw new Error("No puedes editar sub invitados de este invitado");
  }

  await db.insert(guestCompanions).values({
    guestId,
    name: parsed.name,
    status: parsed.status,
    respondedAt: parsed.status === "pending" ? null : new Date()
  });

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${guest.id}`);
  revalidatePath(`/i/${guest.token}`);
}

export async function updateCompanionAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id"));
  const parsed = companionFormSchema.parse({
    id,
    name: formData.get("name"),
    status: formData.get("status")
  });

  const [companion] = await db
    .select({
      id: guestCompanions.id,
      guestId: guestCompanions.guestId,
      token: guests.token,
      ownerSide: guests.ownerSide
    })
    .from(guestCompanions)
    .innerJoin(guests, eq(guestCompanions.guestId, guests.id))
    .where(eq(guestCompanions.id, id))
    .limit(1);

  if (!companion || companion.ownerSide !== admin.side) {
    throw new Error("No puedes editar este sub invitado");
  }

  await db
    .update(guestCompanions)
    .set({
      name: parsed.name,
      status: parsed.status,
      respondedAt: parsed.status === "pending" ? null : new Date(),
      updatedAt: new Date()
    })
    .where(eq(guestCompanions.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${companion.guestId}`);
  revalidatePath(`/i/${companion.token}`);
}

export async function deleteCompanionAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const id = String(formData.get("id"));
  const [companion] = await db
    .select({
      id: guestCompanions.id,
      guestId: guestCompanions.guestId,
      token: guests.token,
      ownerSide: guests.ownerSide
    })
    .from(guestCompanions)
    .innerJoin(guests, eq(guestCompanions.guestId, guests.id))
    .where(eq(guestCompanions.id, id))
    .limit(1);

  if (!companion || companion.ownerSide !== admin.side) {
    throw new Error("No puedes eliminar este sub invitado");
  }

  await db.delete(guestCompanions).where(eq(guestCompanions.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${companion.guestId}`);
  revalidatePath(`/i/${companion.token}`);
}

export async function updateWeddingAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const bundle = await getWeddingWithEvents();
  if (!bundle) throw new Error("No wedding has been seeded");

  const parsed = weddingFormSchema.parse({
    coupleNames: formData.get("coupleNames"),
    weddingDate: formData.get("weddingDate"),
    heroImageUrl: nullable(formData.get("heroImageUrl")) ?? "",
    introMessage: nullable(formData.get("introMessage")) ?? "",
    finalMessage: nullable(formData.get("finalMessage")) ?? ""
  });

  await db
    .update(weddings)
    .set({
      coupleNames: parsed.coupleNames,
      weddingDate: new Date(parsed.weddingDate),
      heroImageUrl: parsed.heroImageUrl || null,
      introMessage: parsed.introMessage || null,
      finalMessage: parsed.finalMessage || null,
      updatedAt: new Date()
    })
    .where(eq(weddings.id, bundle.wedding.id));

  revalidatePath("/admin/wedding");
  revalidatePath("/admin");
}

export async function updateWeddingEventAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const parsed = weddingEventFormSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    startsAt: formData.get("startsAt"),
    endsAt: nullable(formData.get("endsAt")) ?? "",
    address: formData.get("address"),
    description: nullable(formData.get("description")) ?? "",
    notes: nullable(formData.get("notes")) ?? "",
    googleMapsUrl: nullable(formData.get("googleMapsUrl")) ?? "",
    wazeUrl: nullable(formData.get("wazeUrl")) ?? ""
  });

  await db
    .update(weddingEvents)
    .set({
      name: parsed.name,
      startsAt: new Date(parsed.startsAt),
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
      address: parsed.address,
      description: parsed.description || null,
      notes: parsed.notes || null,
      googleMapsUrl: parsed.googleMapsUrl || null,
      wazeUrl: parsed.wazeUrl || null,
      updatedAt: new Date()
    })
    .where(eq(weddingEvents.id, parsed.id));

  revalidatePath("/admin/wedding");
}
