import { SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";

const command: Command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("add social credit")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("user you want to add credit")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("amount of credit you want to add")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("reason for adding credit")
                .setRequired(true)
        ),
    async run(interaction) {
        await interaction.reply({ content: "hi world!" });
    },
};

export default command;
