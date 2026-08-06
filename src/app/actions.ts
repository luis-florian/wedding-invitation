"use server";

import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  adminNotes,
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
import { normalizeSearchText } from "@/lib/text";
import {
  adminNoteFormSchema,
  companionFormSchema,
  convertGuestToCompanionSchema,
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

function returnToFromForm(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value.trim() : "";
  return path.startsWith("/admin") ? path : null;
}

function withSavedParam(path: string, value: string) {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("saved", value);
  return `${pathname}?${params.toString()}`;
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
  let guestStatus = guest.status;
  let changed = false;
  const guestValue = formData.get("guestStatus");

  if (guestValue) {
    const nextStatus = statusFromForm(guestValue);
    if (nextStatus !== guest.status) {
      await db
        .update(guests)
        .set({
          status: nextStatus,
          respondedAt: now,
          updatedAt: now
        })
        .where(eq(guests.id, guest.id));
      guestStatus = nextStatus;
      changed = true;
    }
  }

  const companions = await db
    .select({ id: guestCompanions.id, status: guestCompanions.status })
    .from(guestCompanions)
    .where(eq(guestCompanions.guestId, guest.id));

  for (const companion of companions) {
    const value = formData.get(`companion:${companion.id}`);
    if (!value) continue;
    const nextStatus = statusFromForm(value);
    if (nextStatus === companion.status) continue;
    await db
      .update(guestCompanions)
      .set({
        status: nextStatus,
        respondedAt: now,
        updatedAt: now
      })
      .where(and(eq(guestCompanions.id, companion.id), eq(guestCompanions.guestId, guest.id)));
    changed = true;
  }

  if (changed) {
    revalidatePath(`/i/${token}`);
    revalidatePath("/admin");
  }

  return { changed, guestStatus };
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

  const confirmDuplicate = formData.get("confirmDuplicate") === "true";
  if (!confirmDuplicate) {
    const existingGuests = await db
      .select({
        id: guests.id,
        name: guests.name
      })
      .from(guests)
      .where(and(eq(guests.weddingId, wedding.id), eq(guests.ownerSide, parsed.ownerSide)));
    const duplicate = existingGuests.find(
      (guest) => normalizeSearchText(guest.name) === normalizeSearchText(parsed.name)
    );

    if (duplicate) {
      const params = new URLSearchParams({
        name: parsed.name,
        duplicateId: duplicate.id,
        duplicateName: duplicate.name
      });
      redirect(`/admin/guests/new?${params.toString()}`);
    }
  }

  const [created] = await db.insert(guests).values({
    weddingId: wedding.id,
    name: parsed.name,
    phone: parsed.phone || null,
    ownerSide: parsed.ownerSide,
    status: parsed.status,
    respondedAt: parsed.status === "pending" ? null : new Date(),
    token: createGuestToken()
  }).returning({ id: guests.id });

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  redirect(`/admin/guests/${created.id}`);
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

  const returnTo = returnToFromForm(formData.get("returnTo"));
  if (returnTo) redirect(withSavedParam(returnTo, "guest"));
}

export async function updateInvitationSentAction(guestId: string, invitationSent: boolean) {
  const admin = await requireAdmin();
  const db = getDb();

  if (typeof invitationSent !== "boolean") {
    throw new Error("Valor de envio invalido");
  }

  const [guest] = await db.select().from(guests).where(eq(guests.id, guestId)).limit(1);
  if (!guest || guest.ownerSide !== admin.side) {
    throw new Error("No puedes editar este invitado");
  }

  await db
    .update(guests)
    .set({
      invitationSent,
      updatedAt: new Date()
    })
    .where(eq(guests.id, guestId));

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${guestId}`);
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

  const returnTo = returnToFromForm(formData.get("returnTo"));
  if (returnTo) redirect(withSavedParam(returnTo, "companion-created"));
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

  const returnTo = returnToFromForm(formData.get("returnTo"));
  if (returnTo) redirect(withSavedParam(returnTo, "companion"));
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

export async function convertGuestToCompanionAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const parsed = convertGuestToCompanionSchema.parse({
    sourceGuestId: formData.get("sourceGuestId"),
    targetGuestId: formData.get("targetGuestId")
  });

  if (parsed.sourceGuestId === parsed.targetGuestId) {
    throw new Error("No puedes convertir un invitado en sub invitado de si mismo");
  }

  const [target] = await db
    .select()
    .from(guests)
    .where(eq(guests.id, parsed.targetGuestId))
    .limit(1);
  const [source] = await db
    .select()
    .from(guests)
    .where(eq(guests.id, parsed.sourceGuestId))
    .limit(1);

  if (
    !target ||
    !source ||
    target.ownerSide !== admin.side ||
    source.ownerSide !== admin.side ||
    target.weddingId !== source.weddingId
  ) {
    throw new Error("No puedes relacionar estos invitados");
  }

  await db.insert(guestCompanions).values({
    guestId: target.id,
    name: source.name,
    status: source.status,
    respondedAt: source.respondedAt
  });
  await db
    .update(guestCompanions)
    .set({
      guestId: target.id,
      updatedAt: new Date()
    })
    .where(eq(guestCompanions.guestId, source.id));
  await db.delete(guests).where(eq(guests.id, source.id));

  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${target.id}`);
  revalidatePath(`/i/${target.token}`);
  revalidatePath(`/i/${source.token}`);
  redirect(`/admin/guests/${target.id}`);
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
    finalMessage: nullable(formData.get("finalMessage")) ?? "",
    inviteMessage: nullable(formData.get("inviteMessage")) ?? ""
  });

  await db
    .update(weddings)
    .set({
      coupleNames: parsed.coupleNames,
      weddingDate: new Date(parsed.weddingDate),
      heroImageUrl: parsed.heroImageUrl || null,
      introMessage: parsed.introMessage || null,
      finalMessage: parsed.finalMessage || null,
      inviteMessage: parsed.inviteMessage || null,
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

export async function updateAdminNoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const parsed = adminNoteFormSchema.parse({
    side: formData.get("side"),
    body: formData.get("body") ?? ""
  });

  if (parsed.side !== admin.side) {
    throw new Error("No puedes editar esta nota");
  }

  const [existing] = await db
    .select()
    .from(adminNotes)
    .where(eq(adminNotes.side, parsed.side))
    .limit(1);

  if (existing) {
    await db
      .update(adminNotes)
      .set({
        body: parsed.body,
        updatedAt: new Date()
      })
      .where(eq(adminNotes.id, existing.id));
  } else {
    await db.insert(adminNotes).values({
      side: parsed.side,
      body: parsed.body
    });
  }

  revalidatePath("/admin/notes");
  redirect("/admin/notes?saved=note");
}
