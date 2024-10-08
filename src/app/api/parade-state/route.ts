import prisma from "@/lib/prisma";
import { sendTelegramState } from "@/lib/utils";
import { Company } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const companies = await prisma.company.findMany();

  companies.forEach(async (company: Company) => {
    await sendTelegramState(company);
  });
}
