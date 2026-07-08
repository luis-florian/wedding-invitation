import { z } from "zod";

export const rsvpStatusSchema = z.enum(["pending", "confirmed", "declined"]);
export const adminSideSchema = z.enum(["groom", "bride"]);

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un email valido"),
  password: z.string().min(1, "Ingresa tu contrasena")
});

export const setupAdminsSchema = z.object({
  setupSecret: z.string().min(1, "Ingresa la clave de setup"),
  groomName: z.string().trim().min(1).max(120),
  groomEmail: z.string().trim().email(),
  groomPassword: z.string().min(8),
  brideName: z.string().trim().min(1).max(120),
  brideEmail: z.string().trim().email(),
  bridePassword: z.string().min(8)
});

export const guestFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(160),
  phone: z.string().trim().max(40).optional(),
  ownerSide: adminSideSchema,
  status: rsvpStatusSchema
});

export const companionFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(160),
  status: rsvpStatusSchema
});

export const weddingFormSchema = z.object({
  coupleNames: z.string().trim().min(1).max(180),
  weddingDate: z.string().min(1),
  heroImageUrl: z.string().trim().url().or(z.literal("")).optional(),
  introMessage: z.string().trim().max(2000).optional(),
  finalMessage: z.string().trim().max(2000).optional()
});

export const weddingEventFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(160),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  address: z.string().trim().min(1).max(500),
  description: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
  googleMapsUrl: z.string().trim().url().or(z.literal("")).optional(),
  wazeUrl: z.string().trim().url().or(z.literal("")).optional()
});
