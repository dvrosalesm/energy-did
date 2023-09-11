#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dotenv = require("dotenv");
const attestation_1 = require("./attestation");
dotenv.config();
const program = new commander_1.Command();
program
    .command("attest")
    .description("Attest a pending claim")
    .argument("<claim>", "claim id")
    .action(async (claim) => {
    await (0, attestation_1.attestClaim)(claim);
});
program
    .command("list-pending")
    .description("List pending claims")
    .action(async (claim) => {
    await (0, attestation_1.getAllClaims)();
});
program.parse();
//# sourceMappingURL=index.js.map