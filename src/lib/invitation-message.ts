export const defaultInviteMessage = `Hola... 🤍

Con mucho amor y mucha ilusión, queremos decirte que estás cordialmente invitado a nuestra boda. Será un gran placer compartir este hermoso momento juntos.

Con mucho cariño,
Nathaly y Luis.`;

export function buildInvitationShareText(message: string | null | undefined, invitationUrl: string) {
  const body = message?.trim() || defaultInviteMessage;

  return `${body}

Tu invitación:
${invitationUrl}`;
}
