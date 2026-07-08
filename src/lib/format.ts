import type { AdminSide, RsvpStatus } from "@/db/schema";

export const sideLabels: Record<AdminSide, string> = {
  groom: "Novio",
  bride: "Novia"
};

export const statusLabels: Record<RsvpStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "No asistira"
};

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Guatemala"
  }).format(date);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "full",
    timeZone: "America/Guatemala"
  }).format(date);
}
