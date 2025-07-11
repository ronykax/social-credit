import path from "path";
import fs from "fs";
import type { Command } from "./types";

type CommandAccumulator = {
    commands: Command[];
};

class CommandCollector {
    private baseDir: string;

    constructor(relativePathSegments: string[]) {
        this.baseDir = path.resolve(process.cwd(), ...relativePathSegments);
    }

    public collect(): Promise<Command[]> {
        return new Promise((resolve, reject) => {
            try {
                const files = this.readCommandDirectory();
                this.loadCommands(files)
                    .then((result) => resolve(result.commands))
                    .catch((err) => reject(err));
            } catch (err) {
                reject(err);
            }
        });
    }

    private readCommandDirectory(): string[] {
        try {
            return fs.readdirSync(this.baseDir).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
        } catch (err) {
            throw new Error(`failed to read directory: ${this.baseDir}`);
        }
    }

    private async loadCommands(files: string[]): Promise<CommandAccumulator> {
        const accumulator: CommandAccumulator = { commands: [] };

        for (const file of files) {
            const commandPath = path.join(this.baseDir, file);
            const commandModule = await this.safeImport(commandPath);
            if (commandModule?.default) {
                accumulator.commands.push(commandModule.default as Command);
            }
        }

        return accumulator;
    }

    private async safeImport(modulePath: string): Promise<any> {
        try {
            return await import(modulePath);
        } catch (err) {
            console.error(`failed to import command: ${modulePath}`, err);
            return null;
        }
    }
}

export default async function getCommands(): Promise<Command[]> {
    const collector = new CommandCollector(["src", "commands"]);
    return await collector.collect();
}
