import type { AdminSide } from "@/db/schema";
import { rsvpStatusSchema } from "@/lib/validation";

export function parseGuestView(value: string | string[] | undefined) {
  if (value === "groom" || value === "bride") return value satisfies AdminSide;
  return "all" as const;
}

export function parseStatusFilter(value: string | string[] | undefined) {
  const parsed = rsvpStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}
