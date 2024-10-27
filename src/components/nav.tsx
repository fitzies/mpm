"use client";

import { ArrowUpRight, Bell, Menu, Sparkles, User } from "lucide-react";
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
import { MouseEventHandler, useState } from "react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const NavItem = ({
  title,
  selected,
  href,
  large,
  onClick,
  mobile,
}: {
  title: string;
  selected: boolean;
  href: string; // Add href prop
  large?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  mobile?: boolean;
}) => {
  return (
    <Link href={href} onClick={onClick}>
      <p
        className={`text-sm font-medium hover:text-white duration-150 cursor-pointer ${
          !selected ? "text-zinc-400" : "text-black dark:text-white"
        } ${large ? "!text-lg" : ""} ${mobile ? "lg:!text-transparent" : ""}`}
      >
        {title}
      </p>
    </Link>
  );
};

const Nav = () => {
  const [navOpened, setNavOpened] = useState<boolean>(false);
  const pathname = usePathname();

  // Hide Nav if the pathname is just '/'
  if (
    pathname === "/" ||
    pathname.includes("/polar") ||
    pathname.includes("/barrack-damages") ||
    pathname.includes("/post-action-review") ||
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

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <>
      <div
        className={`w-screen fixed px-8 py-3 z-50 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 bg-white dark:bg-zinc-950 ${
          navOpened ? "!hidden" : ""
        }`}
      >
        <div className="hidden lg:flex gap-6 justify-start items-center">
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
        </div>
        <div
          className="lg:hidden flex"
          onClick={() => setNavOpened((prev) => !prev)}
        >
          <Menu />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Popover>
            <PopoverTrigger>
              <Bell className="text-zinc-400 scale-90" />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              You have no notifications
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:mr-3">
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
              <DropdownMenuItem asChild>
                <Link
                  href={`/post-action-review`}
                  className="cursor-pointer"
                  target="_blank"
                >
                  Post Action Review
                  <ArrowUpRight className="scale-75" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <motion.nav
        className="flex-col px-8 py-8 gap-4 fixed z-50 bg-black w-full h-screen lg:hidden lg:bg-transparent flex"
        variants={variants}
        transition={{ duration: 0.25 }}
        animate={navOpened ? "open" : "closed"}
      >
        <NavItem
          title="Dashboard"
          selected={isDashboard}
          href={`/company/${companyName}`}
          large
          onClick={() => setNavOpened((prev) => !prev)}
          mobile
        />
        <NavItem
          title="Conducts"
          selected={isConducts}
          href={`/company/${companyName}/conducts`}
          large
          onClick={() => setNavOpened((prev) => !prev)}
          mobile
        />
        <NavItem
          title="Statuses"
          selected={isStatuses}
          href={`/company/${companyName}/statuses`}
          large
          onClick={() => setNavOpened((prev) => !prev)}
          mobile
        />
      </motion.nav>
    </>
  );
};

export default Nav;
