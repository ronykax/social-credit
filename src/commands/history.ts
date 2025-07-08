import { SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";
import timestamp from "../utils/iso-to-timestamp";

const command: Command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("history")
        .setDescription("check a user's credit history")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("the user you want to check")
                .setRequired(true)
        ),
    async run(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const target = interaction.options.getUser("user", true);

        const list = await pb
            .collection("history")
            .getList(1, 10, {
                sort: "-amount",
                filter: `user.user_id="${target.id}"`,
                expand: "author,user",
            })
            .catch(() => null);

        if (!list) {
            await interaction.editReply({
                content:
                    "couldn't get the user's credit history! try again later.",
            });

            return;
        }

        let content = "";

        for (const record of list.items) {
            if (!record.expand) return;

            content += `1. ${record.amount} - author: <@${
                record.expand.author.user_id
            }> - ${record.reason} - ${timestamp(record.created, "R")}\n`;
        }

        await interaction.editReply({
            content: `${target.username}'s credit history:\n${content}`,
        });
    },
};

export default command;
