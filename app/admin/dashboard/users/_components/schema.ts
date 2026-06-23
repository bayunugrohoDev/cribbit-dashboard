import z from "zod";

// This schema is based on the data returned by the `get_users_with_auth` RPC function
// It includes fields from both `profiles` and `auth.users`

const appRoleEnum = z.enum(["user", "admin", "super_admin"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  updated_at: z.string().nullable(),
  username: z.string().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  website: z.string().url().nullable(),
  role: appRoleEnum.nullable(),
  
  // Fields from auth.users
  email: z.string().email().nullable(),
  registered_at: z.string().nullable(),
  last_login: z.string().nullable(),
});

export type UserSchema = z.infer<typeof userSchema>;