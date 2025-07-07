import { SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";

const command: Command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("leaderboard")
        .setDescription(
            "show the top users with the highest social credit score"
        )
        .addBooleanOption((option) =>
            option.setName("global").setDescription("show global leaderboard?")
        ),
    async run(interaction) {
        await interaction.deferReply({ flags: ["Ephemeral"] });

        const data = await pb
            .collection("people")
            .getList(1, 10, { sort: "-credit" })
            .catch(() => null);

        if (!data) {
            await interaction.editReply({
                content: "something went wrong! try again later.",
            });

            return;
        }

        let content = "";
        // let index = 0;

        for (const record of data.items) {
            // content += `1. ${index <= 2 ? ` ${rankEmoji(index)} ` : ""}<@${record.user_id}> - ${record.credit} points\n`;
            content += `1. <@${record.user_id}> - ${record.credit} points\n`;
            // index += 1;
        }

        await interaction.editReply({ content });
    },
};

export default command;
