#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dotenv = require("dotenv");
const verification_1 = require("./verification");
dotenv.config();
const program = new commander_1.Command();
program
    .command("request-verify")
    .description("Requests verification of the owner of a crendential")
    .argument("<credential>", "credential id")
    .action(async (claim) => {
    await (0, verification_1.requestVerification)(claim);
});
program
    .command("list-verify")
    .description("Lists verifications of the owner of a crendential")
    .action(async () => {
    await (0, verification_1.getAllClaims)();
});
program.parse();
//# sourceMappingURL=index.js.map