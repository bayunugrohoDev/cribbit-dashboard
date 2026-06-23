import z from "zod";

export const agentSchema = z.object({
  id: z.string().uuid(),
  company_name: z.string(),
  created_at: z.string(),
  region: z.string().nullable(),
  profile: z
    .object({
      full_name: z.string().nullable(),
      email: z.string().nullable(),
      avatar_url: z.string().url().nullable(),
    })
    .nullable(),
});

export type AgentSchema = z.infer<typeof agentSchema>;
