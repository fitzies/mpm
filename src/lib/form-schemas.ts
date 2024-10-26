import { z } from "zod";

export const barrackDamageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Rank & Name is required" })
    .max(50)
    .regex(
      /^(?:PVT|LCP|CPL|CFC|3SG|2SG|1SG|SSG|MSG|3WO|2WO|1WO|MWO|SWO|CWO|2LT|LTA|CPT|MAJ|LTC|SLTC|COL|BG|MG|LG)\s[A-Z][a-zA-Z]*$/,
      { message: "Invalid format. Use 'Rank Name' (e.g., '3SG Brian')." }
    ),
  company: z.string().min(1, { message: "Company is required" }),
  type: z.string().min(1, { message: "Type of barrack damage is required" }),
  dateReported: z.date({ required_error: "A date reported is required" }),
  description: z
    .string()
    .min(10, { message: "The description must be at least 10 characters." }),
  severe: z.boolean(),
});
