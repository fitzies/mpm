"use client";

import { ArrowUpRight, Sparkles, User } from "lucide-react";
import Link from "next/link"; // Import Link from next/link
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          !selected ? "text-zinc-400" : "text-black dark:text-white"
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
  if (
    pathname === "/" ||
    pathname.includes("/polar") ||
    pathname.includes("/barrack-damages") ||
    pathname.includes("/login")
  ) {
    return null;
  }

  const pathArr = pathname.split("/");

  // Determine which NavItem should be selected
  const companyName = pathArr[2]; // Get the company name from the path
  const isDashboard = pathArr[1] === "company" && pathArr.length === 3; // company/{companyName}
  const isConducts = pathArr[1] === "company" && pathArr[3] === "conducts"; // company/{companyName}/conducts
  const isStatuses = pathArr[1] === "company" && pathArr[3] === "statuses"; // company/{companyName}/statuses
  // const isStrength = pathArr[1] === "company" && pathArr[3] === "strength"; // company/{companyName}/statuses

  return (
    <div className="w-screen fixed px-8 py-3 z-50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 bg-white dark:bg-zinc-950">
      <Sparkles className="lg:block hidden" />
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
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto lg:mr-3">
          <Avatar>
            <AvatarFallback>
              <User className="scale-90" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Company</DropdownMenuLabel>
          {/* <DropdownMenuItem asChild>
            <Link href={`/profile`}>Profile</Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link
              href={`/company/${companyName}/insights`}
              className="cursor-pointer"
            >
              Company Insights
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/company/${companyName}/nominal-roll`}
              className="cursor-pointer"
            >
              Nominal Roll
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/barrack-damages`}
              className="cursor-pointer"
              target="_blank"
            >
              Barrack Damages
              <ArrowUpRight className="scale-75" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Nav;
