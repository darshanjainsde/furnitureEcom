import { AdminHeader } from "@/components/admin/ui";
import { LeadsView } from "@/components/admin/LeadsView";

export const dynamic = "force-dynamic";

export default async function BusinessLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return (
    <>
      <AdminHeader title="Leads" description="Every enquiry from your website, newest first." />
      <LeadsView status={status} basePath="/business/leads" />
    </>
  );
}
