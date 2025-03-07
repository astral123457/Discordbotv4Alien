import { 
    ActionRowBuilder, 
    GuildMember,
    PermissionsBitField, 
    ApplicationCommandType, 
    ButtonBuilder, 
    ButtonStyle, 
    Collection, 
    EmbedBuilder, 
    italic, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    time, 
    ButtonInteraction, 
    ModalSubmitInteraction 
} from "discord.js";
import { CommandType } from "../../structs/types/Command";

const members: Collection<string, string> = new Collection();

const verifyModal = new ModalBuilder({
    customId: "verify-code-modal",
    title: "Verificação",
    components: [
        new ActionRowBuilder<TextInputBuilder>({
            components: [
                new TextInputBuilder({
                    custom_id: "verify-code-input",
                    label: "Código da verificação",
                    placeholder: "Insira o código de verificação",
                    style: TextInputStyle.Short,
                    required: true
                })
            ]
        })
    ]
});

const verifyCommand: CommandType = {
    name: "verificar",
    description: "Realize uma verificação padrão",
    type: ApplicationCommandType.ChatInput,
    run: async ({ interaction }) => {
        if (!interaction.inCachedGuild()) return;

        const { member, guild } = interaction;

        // Verifica se o cargo "Verificado" já existe
        let role = guild.roles.cache.find(r => r.name === "Verificado");
        if (!role) {
            // Cria o cargo "Verificado" se não existir
            role = await guild.roles.create({
                name: 'Verificado',
                permissions: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.Speak,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.AttachFiles
                ],
                color: '#34bf36',
                reason: 'Cargo de verificação criado pelo comando verificar',
            });

            await interaction.reply({ ephemeral: true, content: `Novo cargo criado: ${role.name}` });
        }

        // Verifica se o membro já tem o cargo
        if (member.roles.cache.has(role.id)) {
            await interaction.reply({ ephemeral: true, content: "Você já está verificado!" });
            return;
        }

        if (members.has(member.id)) {
            await interaction.showModal(verifyModal);
            return;
        }

        const code = randomText();
        const timestamp = new Date(Date.now() + 30000);

        await interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder({
                    title: "Sistema de verificação",
                    description: `Você precisará digitar o código a seguir: ||${code}||
                    Copie e cole no formulário que será exibido 
                    ${italic(`O código expira ${time(timestamp, "R")}`)}
                    > Clique no botão abaixo para verificar`,
                })
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder({
                            custom_id: "verify-code-button",
                            label: "Verificar",
                            style: ButtonStyle.Success
                        })
                    ]
                })
            ]
        });

        members.set(member.id, code);
        setTimeout(() => members.delete(member.id), 30000);
    },
    buttons: new Collection([
        ["verify-code-button", async (interaction) => {
            console.log('Botão de verificação pressionado'); // Log de depuração
            if (!interaction.inCachedGuild()) return;
            const { member, guild } = interaction;

            const role = guild.roles.cache.find(r => r.name === "Verificado");
            if (!role) {
                await interaction.update({ content: "Cargo não configurado!", embeds: [], components: [] });
                return;
            }

            if (member.roles.cache.has(role.id)) {
                await interaction.update({ content: "Você já está verificado!", embeds: [], components: [] });
                return;
            }

            if (!members.has(member.id)) {
                await interaction.update({ content: `Utilize o comando \`/verificar\` novamente!` });
                return;
            }

            await interaction.showModal(verifyModal);
        }]
    ]),
    modals: new Collection([
        ["verify-code-modal", async (interaction) => {
            console.log('Modal de verificação aberto'); // Log de depuração
            if (!interaction.inCachedGuild()) return;

            const { guild, fields } = interaction;
            const member = interaction.member as GuildMember & { id: string };

            const code = members.get(member.id);
            const inputCode = fields.getTextInputValue("verify-code-input");

            if (code === inputCode) {
                const role = guild.roles.cache.find(r => r.name === "Verificado");
                if (role) {
                    await member.roles.add(role);
                    await interaction.reply({ content: "Você foi verificado com sucesso!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Cargo de verificação não encontrado!", ephemeral: true });
                }
            } else {
                await interaction.reply({ content: "Código de verificação incorreto!", ephemeral: true });
            }
        }]
    ])
};

export default verifyCommand;

function randomText() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}
