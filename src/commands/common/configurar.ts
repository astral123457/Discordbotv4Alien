import { ApplicationCommandOptionType, ApplicationCommandType, Guild, GuildMember, TextChannel } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "configurar",
    description: "Configurar o servidor de suporte e canal de anúncios",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "servidor_de_suporte",
            description: "Definir um servidor de suporte para este aplicativo",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Servidor de AuroraLuz', value: 'https://discord.gg/n4zrcnx2HX' },
                { name: 'Alienware Ofertas', value: 'https://discord.gg/Cf8bwzyhmF' }
            ]
        },
        {
            name: "canal_de_anuncios",
            description: "Selecionar um canal para assinar nossos anúncios",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channel_types: [0] // 0 representa um canal de texto
        },
    ],
    async run({ interaction, options }) {
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;
        const { guild } = interaction;

        await interaction.deferReply({ ephemeral: true });

        const suporteServidor = options.getString("servidor_de_suporte", true);
        const anunciosCanal = options.getChannel("canal_de_anuncios", true) as TextChannel;

        // Salvar as configurações de servidor e canal (substitua por sua lógica de armazenamento)
        // Aqui estamos apenas respondendo com as opções selecionadas
        interaction.editReply({
            content: `Servidor de suporte configurado: ${suporteServidor}\nCanal de anúncios configurado: ${anunciosCanal}`,
        });
    },
});
