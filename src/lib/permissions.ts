import type { AdminSide } from "@/db/schema";

export function canEditSide(adminSide: AdminSide, ownerSide: AdminSide) {
  return adminSide === ownerSide;
}
