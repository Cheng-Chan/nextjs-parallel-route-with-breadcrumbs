import "server-only";

import { cache } from "react";

export type VendingMachine = {
  code: string;
  displayCode: string;
  location: string;
  status: "Active" | "Maintenance";
};

const vendingMachines: Readonly<Record<string, VendingMachine>> = Object.freeze({
  "004915": Object.freeze({
    code: "004915",
    displayCode: "004915",
    location: "Pilot Station A",
    status: "Active",
  }),
});

const simulatedLookupDelayMs = 650;

export function listVendingMachines(): VendingMachine[] {
  return Object.values(vendingMachines);
}

export const getVendingMachineByCode = cache(
  async (code: string): Promise<VendingMachine | null> => {
    await new Promise((resolve) => setTimeout(resolve, simulatedLookupDelayMs));

    return vendingMachines[code] ?? null;
  },
);
