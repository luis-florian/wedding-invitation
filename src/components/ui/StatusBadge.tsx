import type { RsvpStatus } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import styles from "./status-badge.module.css";

export function StatusBadge({ status, label }: { status: RsvpStatus; label?: string }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{label ?? statusLabels[status]}</span>;
}
