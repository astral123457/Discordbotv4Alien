import { ApplicationCommandType, GuildMember, PermissionsBitField, Message } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "admin",
    description: "admin command",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, options }) {
        if (!interaction.inCachedGuild()) return;
        const { guild, member } = interaction;

        // Verifica se o canal está disponível
        if (!interaction.channel) {
            return interaction.reply({ content: "Este comando só pode ser usado em um canal de texto.", ephemeral: true });
        }

        // Solicita a senha ao usuário
        await interaction.reply({ content: "Por favor, insira a senha para executar este comando:", ephemeral: true });

        // Aguarda a resposta do usuário
        const filter = (response: Message) => response.author.id === interaction.user.id;
        try {
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
            const password = collected.first()?.content;

            // Verifica se a senha está correta
            if (password !== "1234") {
                return interaction.followUp({ content: "Senha incorreta. Comando não executado.", ephemeral: true });
            }
        } catch (error) {
            return interaction.followUp({ content: "Tempo esgotado. Comando não executado.", ephemeral: true });
        }

        // Verifica se o bot tem a permissão necessária
        if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.followUp({ content: "Eu não tenho permissão para gerenciar cargos.", ephemeral: true });
        }

        // Verifica se o cargo "Admin" já existe
        let adminRole = guild.roles.cache.find(role => role.name === 'Admin');
        if (!adminRole) {
            // Cria um novo cargo de administrador se não existir
            adminRole = await guild.roles.create({
                name: 'Admin',
                permissions: [PermissionsBitField.Flags.Administrator],
                color: '#eb3434',
                reason: 'Cargo de administrador criado pelo comando exemple',
            });

            // Responde com o nome do novo cargo
            await interaction.followUp({ content: `Novo cargo criado: ${adminRole.name}`, ephemeral: true });
        } else {
            // Responde que o cargo já existe
            await interaction.followUp({ content: `O cargo ${adminRole.name} já existe.`, ephemeral: true });
        }

        // Verifica se o membro já tem o cargo
        if (member instanceof GuildMember) {
            if (member.roles.cache.has(adminRole.id)) {
                await interaction.followUp({ content: `Você já tem o cargo: ${adminRole.name}`, ephemeral: true });
            } else {
                // Adiciona o novo cargo ao membro
                await member.roles.add(adminRole);
                await interaction.followUp({ content: `Você agora tem o cargo: ${adminRole.name}`, ephemeral: true });
            }
        }
    }
});
