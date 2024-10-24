"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { DataTableType } from "../../types";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function DataTable({
  data,
  selected,
  setSelected,
}: {
  data: DataTableType;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
}) {
  // const [selected, setSelected] = useState<number[]>([]);

  const isAllSelected = selected.length === data.rows.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected(() => []);
    } else {
      setSelected(data.rows.map((_, index) => index));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]
    );
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox checked={isAllSelected} onClick={handleSelectAll} />
          </TableHead>
          {data.headers.map((header, index) => (
            <TableHead
              key={`header-${index}`}
              className="first:w-[100px] last:text-right"
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.rows.map((cells, rowIndex) => (
          <TableRow
            key={`row-${rowIndex}`}
            className={
              selected.includes(rowIndex)
                ? "bg-zinc-100/50 dark:bg-zinc-800/50"
                : "bg-transparent"
            }
          >
            <TableCell>
              <Checkbox
                checked={selected.includes(rowIndex)}
                onClick={() => handleSelectRow(rowIndex)}
              />
            </TableCell>
            {cells.map((cell, cellIndex) => (
              <TableCell
                key={`cell-${rowIndex}-${cellIndex}`}
                className="first:font-medium last:text-right"
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
