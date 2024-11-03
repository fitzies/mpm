import prisma from "@/lib/prisma";
import { sendTelegramState } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Company } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const companies = await prisma.company.findMany();

    // Use Promise.all to send all messages concurrently
    await Promise.all(
      companies.map((company: Company) => sendTelegramState(company))
    );

    // Return a response after processing all companies
    return NextResponse.json({
      message: "All companies processed successfully.",
    });
  } catch (error) {
    console.error("Error processing companies:", error);
    return NextResponse.json(
      { error: "Failed to process companies." },
      { status: 500 }
    );
  }
}
