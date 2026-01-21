export type UserStatus = "active" | "pending" | "banned";
export type UserRole = "admin" | "editor" | "viewer";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  registeredAt: string; // Using string for simplicity, can be Date
  status: UserStatus;
  role: UserRole;
};
