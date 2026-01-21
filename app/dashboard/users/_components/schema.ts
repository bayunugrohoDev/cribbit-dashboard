import z from "zod";

export const UserStatus = ["active", "pending", "banned"] as const;
export const UserRole = ["admin", "editor", "viewer"] as const;

export type UserStatus = (typeof UserStatus)[number];
export type UserRole = (typeof UserRole)[number];

// export type User = {
//   id: string;
//   name: string;
//   avatar: string;
//   email: string;
//   registeredAt: string; // Using string for simplicity, can be Date
//   status: UserStatus;
//   role: UserRole;
// };

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  email: z.string().email(),
  status: z.enum(UserStatus),
  role: z.enum(UserRole),
  registeredAt: z.string(),
});
