"use client";

import { Clipboard } from "lucide-react";
import Link from "next/link"; // Import Link from next/link
import { usePathname } from "next/navigation";

const NavItem = ({
  title,
  selected,
  href,
}: {
  title: string;
  selected: boolean;
  href: string; // Add href prop
}) => {
  return (
    <Link href={href}>
      <p
        className={`text-sm font-medium hover:text-white duration-150 cursor-pointer ${
          !selected ? "text-zinc-400" : "text-white"
        }`}
      >
        {title}
      </p>
    </Link>
  );
};

const Nav = () => {
  const pathname = usePathname();

  // Hide Nav if the pathname is just '/'
  if (pathname === "/") {
    return null;
  }

  const pathArr = pathname.split("/");

  // Determine which NavItem should be selected
  const companyName = pathArr[2]; // Get the company name from the path
  const isDashboard = pathArr[1] === "company" && pathArr.length === 3; // company/{companyName}
  const isConducts = pathArr[1] === "company" && pathArr[3] === "conducts"; // company/{companyName}/conducts
  const isStatuses = pathArr[1] === "company" && pathArr[3] === "statuses"; // company/{companyName}/statuses

  return (
    <div className="w-screen fixed px-8 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 bg-white dark:bg-zinc-950">
      <Clipboard />
      <NavItem
        title="Dashboard"
        selected={isDashboard}
        href={`/company/${companyName}`}
      />
      <NavItem
        title="Conducts"
        selected={isConducts}
        href={`/company/${companyName}/conducts`}
      />
      <NavItem
        title="Statuses"
        selected={isStatuses}
        href={`/company/${companyName}/statuses`}
      />
    </div>
  );
};

export default Nav;
