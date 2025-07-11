import {
    AttachmentBuilder,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";
import path from "path";
import getAttachment from "../utils/get-attachment";

const command: Command = {
    data: new SlashCommandSubcommandBuilder()
        .setName("leaderboard")
        .setDescription(
            "show the top users with the highest social credit score"
        ),
    // .addBooleanOption((option) =>
    //     option.setName("global").setDescription("show global leaderboard?")
    // ),
    async run(interaction) {
        await interaction.deferReply();

        const data = await pb
            .collection("social_credit_people")
            .getList(1, 10, { sort: "-credit" })
            .catch(() => null);

        if (!data) {
            await interaction.editReply({
                content: "something went wrong! try again later.",
            });

            return;
        }

        const description =
            data.items.length > 0
                ? data.items
                      .map(
                          (record, i) =>
                              `${i + 1}. <@${record.user_id}> - **\`${
                                  record.credit
                              }\`** POINTS`
                      )
                      .join("\n")
                : "sybau 💔🥀";

        const attachment = getAttachment("omg.png");

        const embed = new EmbedBuilder()
            .setTitle("\\🏆 TOP SOCIAL CREDIT HOLDERS")
            .setColor("#f80509")
            .setDescription(description)
            .setThumbnail(attachment.url)
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed],
            files: [attachment.attachment],
        });
    },
};

export default command;
