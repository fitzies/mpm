const PageWrapper = ({
  children,
  className,
}: {
  children: JSX.Element | JSX.Element[];
  className?: string;
}) => {
  return (
    <div className={`w-[98vw] px-8 pb-12 pt-20 ${className}`}>{children}</div>
  );
};

export default PageWrapper;
