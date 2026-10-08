import "server-only";

import { cache } from "react";

export type User = {
  id: string;
  name: string;
};

const users: Readonly<Record<string, User>> = Object.freeze({
  "123": Object.freeze({ id: "123", name: "Sokha" }),
  "456": Object.freeze({ id: "456", name: "Dara" }),
});

const simulatedLookupDelayMs = 650;

export function listUsers(): User[] {
  return Object.values(users);
}

export const getUserById = cache(async (id: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, simulatedLookupDelayMs));

  return users[id] ?? null;
});
