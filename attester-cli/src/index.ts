#! /usr/bin/env node

import { Command } from "commander";
import * as dotenv from "dotenv";
import { attestClaim, getAllClaims } from "./attestation";

dotenv.config({
  path: "../.env",
});

const program = new Command();

program
  .command("attest")
  .description("Attest a pending claim")
  .argument("<claim>", "claim id")
  .action(async (claim: string) => {
    await attestClaim(claim);
  });

program
  .command("list-pending")
  .description("List pending claims")
  .action(async (claim: string) => {
    await getAllClaims();
  });

program.parse();
