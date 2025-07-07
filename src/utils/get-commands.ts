import path from "path";
import fs from "fs";
import type { Command } from "./types";

export default async function getCommands() {
    const files = fs.readdirSync(path.join(process.cwd(), "src", "commands"));
    let commands = [];

    for (const file of files) {
        const filePath = path.join(process.cwd(), "src", "commands", file);
        const command = (await import(filePath)).default as Command;

        commands.push(command);
    }

    return commands;
}
