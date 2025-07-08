import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";
import timestamp from "../utils/iso-to-timestamp";
import getAttachment from "../utils/get-attachment";

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
        await interaction.deferReply();
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

        const attachment = getAttachment("johnchina.png");

        const embed = new EmbedBuilder()
            .setTitle(`\\📜 ${target.username.toUpperCase()}'s CREDIT HISTORY`)
            .setColor("#f80509")
            .setTimestamp()
            .setThumbnail(attachment.url);

        let description = "";

        for (const [i, record] of list.items.entries()) {
            if (!record.expand) continue;

            description += `${i + 1}. **\`${record.amount}\`** by <@${
                record.expand.author.user_id
            }> - ${record.reason} (${timestamp(record.created, "R")})\n`;
        }

        embed.setDescription(description || "sybau 💔🥀");

        await interaction.editReply({
            embeds: [embed],
            files: [attachment.attachment],
        });
    },
};

export default command;
