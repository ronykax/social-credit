import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import pb from "../utils/pocketbase";
import timestamp from "../utils/iso-to-timestamp";
import getAttachment from "../utils/get-attachment";

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
        await interaction.deferReply();

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

        const attachment = getAttachment("omg.png");

        const embed = new EmbedBuilder()
            .setTitle("\\📝 SOCIAL CREDIT SCORE")
            .setDescription(
                `${target} has \`${
                    record.credit
                }\` social credit.\n\nThey last recieved credit by <@${
                    record.last_author
                }> ${timestamp(record.updated, "R")}.\n> *${record.last_reason}*`
            )
            .setTimestamp()
            .setColor("#f80509")
            .setThumbnail(attachment.url);

        // await interaction.editReply({
        //     content: `${target} has ${
        //         record.credit
        //     } credit!\nThey last recieved credit by <@${
        //         record.last_author
        //     }> ${timestamp(record.updated, "R")} for reason: "${
        //         record.last_reason
        //     }"`,
        // });

        await interaction.editReply({
            embeds: [embed],
            files: [attachment.attachment],
        });
    },
};

export default command;
