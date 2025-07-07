console.clear();

import { Client } from "discord.js";
import getEnv from "./utils/get-env";
import registerCommands from "./utils/register-commands";
import commandGroup from "./utils/command-group";

const client = new Client({ intents: ["GuildMembers"] });

client.once("ready", async () => {
    await registerCommands();
    console.log("app is online!");
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const subCommand = interaction.options.getSubcommand();
        
        const command = commandGroup.get(subCommand);
        if (!command) return;

        await command.run(interaction);
    }
});

client.login(getEnv("DISCORD_CLIENT_TOKEN"));
