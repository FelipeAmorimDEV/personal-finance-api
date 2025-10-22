import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.coerce.number().optional().default(7)
})

export type Env = z.infer<typeof envSchema>