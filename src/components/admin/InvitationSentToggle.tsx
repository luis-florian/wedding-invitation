"use client";

import { useState, useTransition } from "react";
import { updateInvitationSentAction } from "@/app/actions";
import styles from "./admin.module.css";

export function InvitationSentToggle({
  guestId,
  initialValue,
  disabled,
  label
}: {
  guestId: string;
  initialValue: boolean;
  disabled: boolean;
  label: string;
}) {
  const [checked, setChecked] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function updateChecked(nextChecked: boolean) {
    setChecked(nextChecked);

    startTransition(async () => {
      try {
        await updateInvitationSentAction(guestId, nextChecked);
      } catch {
        setChecked(!nextChecked);
      }
    });
  }

  return (
    <label className={styles.sentToggle} data-saving={isPending}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled || isPending}
        aria-label={label}
        onChange={(event) => updateChecked(event.currentTarget.checked)}
      />
      <span>{checked ? "Si" : "No"}</span>
    </label>
  );
}
