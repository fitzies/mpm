import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Chunk({
  title,
  body,
  sub,
  btn,
}: {
  title: string;
  body: string;
  sub?: string;
  btn?: JSX.Element;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
      </CardHeader>
      <CardContent className="flex justify-between">
        <div>
          <div className="text-2xl font-bold">{body}</div>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
        {btn ?? null}
      </CardContent>
    </Card>
  );
}
