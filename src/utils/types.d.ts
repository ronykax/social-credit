import type {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";

export interface Command {
    data: SlashCommandSubcommandBuilder;
    run: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
