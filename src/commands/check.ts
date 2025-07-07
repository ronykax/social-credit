import { SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";

const command: Command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("check")
        .setDescription("check a user's social credit score")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("the user you want to check")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName("history").setDescription("show full history?")
        ),
    async run(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });

        const target = interaction.options.getUser("user", true);

        const record = await pb
            .collection("people")
            .getFirstListItem(`user_id="${target.id}"`)
            .catch(() => null);

        if (!record) {
            await interaction.editReply({
                content: `${target} doesn't have a social credit account!\n-# A social credit account is automatically created when someone's given any amount of social credit.`,
            });
            return;
        }

        await interaction.editReply({
            content: `${target} has ${record.credit} credit!\nThey last recieved credit for "${record.last_reason}"`,
        });
    },
};

export default command;
