import { ApplicationCommandType, GuildMember, PermissionsBitField } from "discord.js";
import { CommandType } from "../../structs/types/Command";

const vipCommand: CommandType = {
    name: "vip-check", // Nome alterado para ser único
    description: "criar cargo vip",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, options }) {
        if (!interaction.inCachedGuild()) return;
        const { guild, member } = interaction;

        // Verifica se o bot tem a permissão necessária
        if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: "Eu não tenho permissão para gerenciar cargos.", ephemeral: true });
        }

        // Verifica se o cargo "VIP" já existe
        let vipRole = guild.roles.cache.find(role => role.name === 'VIP');
        if (!vipRole) {
            // Cria um novo cargo VIP se não existir
            vipRole = await guild.roles.create({
                name: 'VIP',
                permissions: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.Speak,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.AttachFiles
                ],
                color: '#adad2f',
                reason: 'Cargo VIP criado',
            });

            // Responde com o nome do novo cargo
            await interaction.reply({ content: `Novo cargo criado: ${vipRole.name}` });
        } else {
            // Responde que o cargo já existe
            await interaction.reply({ content: `O cargo ${vipRole.name} já existe.` });
        }

        // Verifica se o membro já tem o cargo
        if (member instanceof GuildMember) {
            if (member.roles.cache.has(vipRole.id)) {
                await interaction.followUp({ content: `Você já tem o cargo: ${vipRole.name}` });
            } else {
                // Adiciona o novo cargo ao membro
                await member.roles.add(vipRole);
                await interaction.followUp({ content: `Você agora tem o cargo: ${vipRole.name}` });
            }
        }
    }
};

export default vipCommand;
