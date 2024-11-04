import prisma from "@/lib/prisma";
import { sendTelegramState } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Company } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 55;

// Utility function to create a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    const companies = await (
      await prisma.company.findMany()
    ).filter((coy) => coy.id > 0 && coy.id < 5);

    // Loop through each company, send Telegram state, then wait 1 second
    for (const company of companies) {
      await sendTelegramState(company);
      await delay(3000); // 3-second delay
    }

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
