"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addSpacesToEnumValue, removeSpacesToEnumValue } from "@/lib/utils";
import { ConductType } from "@prisma/client";
import { useState } from "react";

export const ConductSelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState("");

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("conduct", value);
      setValue(() => value);
    } else {
      params.delete("conduct");
      setValue(() => "");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const conductTypes: string[] = (Object.values(ConductType) as string[]).map(
    (item) => addSpacesToEnumValue(item)
  );

  return (
    <>
      <Select value={value} onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          {conductTypes.map((type) => {
            return (
              <SelectItem value={removeSpacesToEnumValue(type)} key={type}>
                {type}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
