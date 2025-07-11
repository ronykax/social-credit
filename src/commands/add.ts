import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import type { Command } from "../utils/types";
import createUser from "../utils/db/create-user";
import pb from "../utils/pocketbase";
import getAttachment from "../utils/get-attachment";

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
        await interaction.deferReply({ flags: ["Ephemeral"] });

        const target = interaction.options.getUser("user", true);
        const amount = interaction.options.getInteger("amount", true);
        const reason = interaction.options.getString("reason", true);

        // create both users if they don't exist
        const { user: receiver } = await createUser(target.id);
        const { user: author } = await createUser(interaction.user.id);

        const newTotal = ((receiver.credit || 0) + amount) as number;

        // add credit
        await pb.collection("social_credit_people").update(receiver.id, {
            user_id: receiver.user_id,
            credit: newTotal,
            last_reason: amount > 0 ? reason : receiver.reason, // only update last_reason if the credit being added is positive
            last_author: author.user_id, // setting the authod id directly because a author `user` is automatically created
        });

        // log history
        await pb.collection("social_credit_history").create({
            user: receiver.id,
            author: author.id,
            amount,
            reason,
            guild_id: interaction.guildId,
        });

        await interaction.editReply({
            content: "🫡",
        });

        if (!interaction.channel) return;
        if (!interaction.channel.isSendable()) return;

        const attachment = getAttachment("johnchina.png");

        const embed = new EmbedBuilder()
            .setTitle(`\\👍 **CREDIT UPDATE**`)
            .setColor("#f80509")
            .setThumbnail(attachment.url)
            .setDescription(
                `**\`${amount > 0 ? "+" : "-"}${Math.abs(amount)}\`** POINTS ${
                    amount > 0 ? "TO" : "FROM"
                } <@${
                    target.id
                }>!!!\n\n> *${reason}*\n\n-# they now have **\`${newTotal}\`** points`
            );
        // .setTimestamp();

        // await interaction.channel.send({
        //     content: `${target} was given 12 social credits by ${interaction.user} for "${reason}"`,
        // });

        await interaction.channel.send({
            embeds: [embed],
            files: [attachment.attachment],
        });
    },
};

export default command;
