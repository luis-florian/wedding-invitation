import { notFound } from "next/navigation";
import { getInvitationByToken } from "@/db/queries/invitation";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export default async function PublicInvitationPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) notFound();

  return <InvitationPage {...invitation} />;
}
