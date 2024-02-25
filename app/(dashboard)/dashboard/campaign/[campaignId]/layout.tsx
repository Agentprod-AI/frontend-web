export default async function CampaignPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-[550px] px-4">{children}</div>;
}
