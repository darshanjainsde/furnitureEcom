import { AdminHeader } from "@/components/admin/ui";
import { LeadsView } from "@/components/admin/LeadsView";

export const dynamic = "force-dynamic";

export default async function OwnerLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return (
    <>
      <AdminHeader title="Leads" description="Read & manage enquiries (also available in the Business portal)." />
      <LeadsView status={status} basePath="/owner/leads" />
    </>
  );
}
