import { z } from "zod";

export const barrackDamageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Rank & Name is required" })
    .max(50),
  company: z.string().min(1, { message: "Company is required" }),
  type: z.string().min(1, { message: "Type of barrack damage is required" }),
  dateReported: z.date({ required_error: "A date reported is required" }),
  description: z
    .string()
    .min(10, { message: "The description must be at least 10 characters." }),
  severe: z.boolean().optional(),
});
