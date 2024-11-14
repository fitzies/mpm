import PageWrapper from "@/components/page-wrapper";

export default async function Page({
  searchParams,
}: {
  searchParams: { date: string };
}) {
  const date = searchParams?.date || "";

  return (
    <PageWrapper className="flex flex-col justify-center items-center h-screen">
      {/* <h1 className="text-3xl font-semibold">{date}</h1> */}
      <p>This feature is coming soon</p>
    </PageWrapper>
  );
}
