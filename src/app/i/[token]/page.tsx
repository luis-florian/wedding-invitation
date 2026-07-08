import { notFound } from "next/navigation";
import { getInvitationByToken } from "@/db/queries/invitation";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export default async function PublicInvitationPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const invitation = await getInvitationByToken(token);

  if (!invitation) notFound();

  return <InvitationPage {...invitation} saved={query.saved === "1"} />;
}
