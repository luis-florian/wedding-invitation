"use client";

import { useState } from "react";
import { Check, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { copyText } from "@/lib/clipboard";
import { buildInvitationShareText, defaultInviteMessage } from "@/lib/invitation-message";

export function CopyInviteMessageButton({
  url,
  message,
  fallbackMessage = defaultInviteMessage,
  label = "Mensaje",
  icon = "message"
}: {
  url: string;
  message?: string | null;
  fallbackMessage?: string;
  label?: string;
  icon?: "message" | "refresh";
}) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await copyText(buildInvitationShareText(message, url, fallbackMessage));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const Icon = icon === "refresh" ? RefreshCw : MessageCircle;

  return (
    <Button type="button" variant="secondary" onClick={copyMessage}>
      {copied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Icon size={16} aria-hidden="true" />
      )}
      {copied ? "Copiado" : label}
    </Button>
  );
}
