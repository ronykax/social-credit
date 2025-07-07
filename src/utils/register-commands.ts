import { REST, Routes, SlashCommandBuilder } from "discord.js";
import getCommands from "./get-commands";
import getEnv from "./get-env";
import commandGroup from "./command-group";

export default async function registerCommands() {
    const subCommands = await getCommands();

    const command = new SlashCommandBuilder()
        .setName("credit")
        .setDescription("main credit command");

    for (const subCommand of subCommands) {
        commandGroup.set(subCommand.data.name, subCommand);
        command.addSubcommand(subCommand.data);
    }

    const rest = new REST({ version: "10" }).setToken(
        getEnv("DISCORD_CLIENT_TOKEN")
    );

    await rest.put(
        Routes.applicationGuildCommands(
            getEnv("DISCORD_CLIENT_ID"),
            getEnv("DISCORD_GUILD_ID")
        ),
        { body: [command] }
    );
}
