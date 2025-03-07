import { ChannelType, TextChannel, CategoryChannel } from 'discord.js';
import { ExtendedClient } from './structs/ExtendedClient';

export const createChannels = async (client: ExtendedClient) => {
    console.log("Iniciando criação de canais...");
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.log("Guilda não encontrada.");
        return;
    }

    // Criação de categoria 'entrada-e-saida'
    let entradaSaidaCategory = guild.channels.cache.find(c => c.name === 'entrada-e-saida' && c.type === ChannelType.GuildCategory) as CategoryChannel;
    if (!entradaSaidaCategory) {
        entradaSaidaCategory = await guild.channels.create({
            name: 'entrada-e-saida',
            type: ChannelType.GuildCategory
        }) as CategoryChannel;
        console.log("Categoria 'entrada-e-saida' criada.");
    } else {
        console.log("Categoria 'entrada-e-saida' já existe.");
    }

    // Criação de canal 'bem-vindos' dentro da categoria 'entrada-e-saida'
    let welcomeChannel = guild.channels.cache.find(ch => ch.name === 'bem-vindos' && ch.type === ChannelType.GuildText) as TextChannel;
    if (!welcomeChannel) {
        welcomeChannel = await guild.channels.create({
            name: 'bem-vindos',
            type: ChannelType.GuildText,
            parent: entradaSaidaCategory.id
        }) as TextChannel;
        console.log("Canal 'bem-vindos' criado.");
    } else {
        console.log("Canal 'bem-vindos' já existe.");
    }

    // Criação de canal 'despedidas' dentro da categoria 'entrada-e-saida'
    let farewellChannel = guild.channels.cache.find(ch => ch.name === 'despedidas' && ch.type === ChannelType.GuildText) as TextChannel;
    if (!farewellChannel) {
        farewellChannel = await guild.channels.create({
            name: 'despedidas',
            type: ChannelType.GuildText,
            parent: entradaSaidaCategory.id
        }) as TextChannel;
        console.log("Canal 'despedidas' criado.");
    } else {
        console.log("Canal 'despedidas' já existe.");
    }

    // Adicione logs similares para os outros canais e categorias
};
