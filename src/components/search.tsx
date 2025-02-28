"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

const Search = ({
  notAbsolute,
  size,
}: {
  notAbsolute?: boolean;
  size?: string;
}) => {
  const seacrchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(seacrchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  });

  return (
    <div
      className={`${
        notAbsolute ? "" : "absolute left-0 hidden lg:block"
      } ${size}`}
    >
      <Input
        type="text"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={seacrchParams.get("query")?.toString()}
      />
    </div>
  );
};

export default Search;
