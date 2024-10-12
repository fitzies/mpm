import { LoginForm } from "@/components/login-form";
import PageWrapper from "@/components/page-wrapper";

const Page = ({ params }: { params: { slug: string } }) => {
  return (
    <PageWrapper className="flex justify-center items-center h-screen">
      <LoginForm />
    </PageWrapper>
  );
};

export default Page;
