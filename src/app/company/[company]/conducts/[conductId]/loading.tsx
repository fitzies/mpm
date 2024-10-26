import PageWrapper from "@/components/page-wrapper";
import Spinner from "@/components/spinner";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <PageWrapper className="w-full h-screen flex justify-center items-center">
      <Spinner />
    </PageWrapper>
  );
}
