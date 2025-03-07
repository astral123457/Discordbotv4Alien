import { ApplicationCommandOptionType, ApplicationCommandType, Guild, GuildMember } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command ({
    name: "limpar",
    description: "Limpar mesagens do chat",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name: "quantidade",
            description: "O total de mesagens a serem excluidas",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "autor",
            description: "Limpar mendagens de apenas um membro",
            type: ApplicationCommandOptionType.User,
            required: false,
        },

    ],
    async run({ interaction, options }){
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;
        const {channel} = interaction;

        await interaction.deferReply({ephemeral: true});
        const amount = Math.min(options.getInteger("quantidade", true), 100);
        const mention = options.getNumber("autor") as GuildMember | null;

        if(!channel){
            interaction.editReply({content: "Nao e possivel limpar menssages!"});
            return;
        }

        const menssages =await channel.messages.fetch();

        if (mention){
            const messages = channel.messages.cache.filter(m => m.author.id == mention.id).first(amount);
            
            return;
        }

        channel.bulkDelete(amount,true)
        .then(cleared => interaction.editReply({
            content:`Foram limpas ${cleared.size} mesagens em ${channel}!`
        }))
        .catch(()=> interaction.editReply({
            content:`Ocorreu um erro ao tentar limpar menagens em ${channel}!`
        }))



    },
}
)