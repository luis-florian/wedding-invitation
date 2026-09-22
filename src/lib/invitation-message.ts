export const defaultInviteMessage = `Hola... 🤍

Con mucho amor y mucha ilusión, queremos decirte que estás cordialmente invitado a nuestra boda. Será un gran placer compartir este hermoso momento juntos.

Con mucho cariño,
Nathaly y Luis.`;

export const defaultReconfirmationMessage = `Hola 🤍 Estamos reconfirmando la asistencia a nuestra boda.

*Si aún no has confirmado tu asistencia o inasistencia, te agradeceríamos mucho hacerlo a la brevedad desde tu invitación.*

Estamos atentos y muchas gracias.

Con cariño,
Nathaly & Luis 🤍`;

export function buildInvitationShareText(
  message: string | null | undefined,
  invitationUrl: string,
  fallbackMessage = defaultInviteMessage
) {
  const body = message?.trim() || fallbackMessage;

  return `${body}

Tu invitación:
${invitationUrl}`;
}
