import PageWrapper from "@/components/page-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllStatusesPerRecruit, getRecruit } from "@/lib/db";
import { plusToString } from "@/lib/utils";
import { Recruit } from "@prisma/client";

export default async function Page({ params }: { params: { id: string } }) {
  const recruit = (await getRecruit(params.id)) as Recruit;

  if (!recruit) {
    <PageWrapper className="w-full h-screen flex justify-center items-center">
      <p>This recruit does not exist</p>
    </PageWrapper>;
  }

  const statuses = await getAllStatusesPerRecruit(recruit);

  return (
    <PageWrapper>
      <h1 className="text-xl font-semibold flex flex-col lg:px-0 px-2">
        {recruit.id} • {recruit.name}
      </h1>
      <div className="border border-zinc-400 dark:border-zinc-800 my-6 rounded-lg px-4 pb-1">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Past Statuses</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((status) => {
              return (
                <TableRow key={status.id}>
                  <TableCell>
                    {status.type === "Other" || status.type === "CustomStatus"
                      ? status.remarks
                      : plusToString(status.type)}
                  </TableCell>
                  <TableCell className="table-cell text-right">{`${status.startDate} - ${status.endDate}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </PageWrapper>
  );
}
