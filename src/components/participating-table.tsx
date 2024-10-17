import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ParticipatingTable = ({
  participants,
  fallouts,
  query,
}: {
  participants: {
    recruitId: string;
    recruitName: string;
    participated: boolean;
    reason: string[];
  }[];
  fallouts: string[];
  query: string;
}) => {
  participants.sort(
    (a, b) =>
      parseInt(a.recruitId.substring(1)) - parseInt(b.recruitId.substring(1))
  );

  const queried =
    query.length > 1
      ? participants.filter(
          (a) =>
            a.recruitName.includes(query.toUpperCase()) ||
            a.recruitId.includes(query.toUpperCase()) ||
            a.reason.includes(query.toUpperCase())
        )
      : participants;

  return (
    <>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            {/* <TableHead className="text-center">Reason</TableHead> */}
            <TableHead className="text-center">Participatated</TableHead>
            <TableHead className="text-right">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queried.map((participant) => {
            // const reason = participant.reason.sort((a, b) => b. - a);
            return (
              <TableRow key={participant.recruitId}>
                <TableCell className="font-medium">
                  {participant.recruitId} {participant.recruitName}
                </TableCell>
                {/* <TableCell className="font-medium">{participant.recruitId} {participant.recruitName}</TableCell> */}
                {/* <TableCell className="text-center"></TableCell> */}
                <TableCell className="text-center">
                  {participant.participated ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-right">
                  {fallouts.includes(participant.recruitId)
                    ? "Fell out"
                    : !participant.participated
                    ? participant.reason.join(", ")
                    : ""}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ParticipatingTable;
