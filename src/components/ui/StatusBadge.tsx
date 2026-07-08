import type { RsvpStatus } from "@/db/schema";
import { statusLabels } from "@/lib/format";
import styles from "./status-badge.module.css";

export function StatusBadge({ status }: { status: RsvpStatus }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{statusLabels[status]}</span>;
}
