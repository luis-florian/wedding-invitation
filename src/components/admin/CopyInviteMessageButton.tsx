"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildInvitationShareText } from "@/lib/invitation-message";

export function CopyInviteMessageButton({
  url,
  message
}: {
  url: string;
  message?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(buildInvitationShareText(message, url));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" variant="secondary" onClick={copyMessage}>
      {copied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <MessageCircle size={16} aria-hidden="true" />
      )}
      {copied ? "Copiado" : "Mensaje"}
    </Button>
  );
}
