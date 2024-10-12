import PageWrapper from "@/components/page-wrapper";

const Page = ({ params }: { params: { slug: string } }) => {
  return (
    // <PageWrapper className="px-32 !py-28">
    //   <h1 className="text-3xl font-semibold">Profile</h1>
    //   <div className="flex justify-between my-4">
    //     <nav className="grid gap-4 text-sm text-muted-foreground">
    //       <Link href="#" className="font-semibold text-primary">
    //         General
    //       </Link>
    //       <Link href="#">Security</Link>
    //       <Link href="#">Integrations</Link>
    //       <Link href="#">Support</Link>
    //       <Link href="#">Organizations</Link>
    //       <Link href="#">Advanced</Link>
    //     </nav>
    //     <SettingsChunk />
    //   </div>
    // </PageWrapper>
    <PageWrapper className="flex justify-center items-center h-screen">
      <div>Coming soon...</div>
    </PageWrapper>
  );
};

export default Page;
