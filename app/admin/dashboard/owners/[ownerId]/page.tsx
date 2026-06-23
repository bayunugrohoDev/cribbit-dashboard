import OwnerDetails from "./_components/OwnerDetails";

export default async function OwnerPage({
  params,
}: {
  params: Promise<{ ownerId: string }>;
}) {
  const { ownerId } = await params;
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <OwnerDetails ownerId={ownerId} />
    </div>
  );
}
