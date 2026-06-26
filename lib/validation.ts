import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  source: z.enum(["home", "product", "category", "contact"]).default("home"),
  productId: z.string().optional().or(z.literal("")),
  // honeypot — handled in the route (non-empty => silently accepted, not stored)
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
