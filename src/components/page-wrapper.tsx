const PageWrapper = ({
  children,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}) => {
  return <div className={`w-screen px-8 py-12 ${className}`}>{children}</div>;
};

export default PageWrapper;
