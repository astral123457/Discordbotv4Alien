import { ApplicationCommandOptionType, ApplicationCommandType, GuildMember } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "support",
    description: "Obtenha o link para o servidor de suporte",
    type: ApplicationCommandType.ChatInput,
    options: [],
    async run({ interaction, options }) {
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;
        const { channel } = interaction;

        await interaction.deferReply({ ephemeral: true });

        if (!channel) {
            interaction.editReply({ content: "Não é possível fornecer o link de suporte!" });
            return;
        }

        // Substitua o link abaixo pelo link do seu servidor de suporte
        const supportLink = "https://discord.gg/seuServidorDeSuporte";

        interaction.editReply({
            content: `Aqui está o link para nosso servidor de suporte: ${supportLink}`
        });
    },
});
