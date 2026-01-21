import { users } from "@/lib/data/users";
import { User } from "@/lib/types/users";

// Simulate a network request
export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 1000); // 1-second delay
  });
};
