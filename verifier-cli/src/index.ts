#! /usr/bin/env node

import { Command } from "commander";
import * as dotenv from "dotenv";
import { getAllClaims, requestVerification } from "./verification";

dotenv.config({
  path: "../.env",
});

const program = new Command();

program
  .command("request-verify")
  .description("Requests verification of the owner of a crendential")
  .argument("<credential>", "credential id")
  .action(async (claim: string) => {
    await requestVerification(claim);
  });

program
  .command("list-verify")
  .description("Lists verifications of the owner of a crendential")
  .action(async () => {
    await getAllClaims();
  });

program.parse();
