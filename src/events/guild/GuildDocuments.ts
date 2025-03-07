import { TextChannel, CategoryChannel, ChannelType, AttachmentBuilder } from 'discord.js';
import { Event } from '../../structs/types/Event';
import config from '../../config.json';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import sharp from 'sharp';
import { join } from 'path'; // Importando join de path

// Carregar a fonte 'Strong Young'
GlobalFonts.registerFromPath(join(__dirname, "../../../assets/fonts/Strong Young.ttf"), 'Strong Young');

export default new Event({
    name: 'guildMemberAdd',
    run: async (member) => {
        const action = 'join';
        const actionText = `Bem-vindo ${member.displayName}`;

        let category = member.guild.channels.cache.find(c => c.name === 'entrada-e-saida' && c.type === ChannelType.GuildCategory) as CategoryChannel;
        if (!category) {
            category = await member.guild.channels.create({
                name: 'entrada-e-saida',
                type: ChannelType.GuildCategory
            }) as CategoryChannel;
            console.log('Categoria criada:', category.name); // Log de depuração
        }

        let channel = member.guild.channels.cache.find(ch => ch.name === 'bem-vindos' && ch.type === ChannelType.GuildText) as TextChannel;
        if (!channel) {
            channel = await member.guild.channels.create({
                name: 'bem-vindos',
                type: ChannelType.GuildText,
                parent: category.id
            }) as TextChannel;
            console.log('Canal criado:', channel.name); // Log de depuração
        }

        // Carregar e desfocar a imagem do banner
        const bannerPath = join(__dirname, "../../../assets/imagens/backgrounds/welcome-image.png");
        const bannerImageBuffer = await sharp(bannerPath).blur(4).toBuffer();
        const bannerImage = await loadImage(bannerImageBuffer);
        console.log('Imagem de boas-vindas carregada e desfocada'); // Log de depuração

        // Criar o Canvas e adicionar a imagem
        const canvas = createCanvas(800, 200);
        const context = canvas.getContext("2d");

        context.drawImage(bannerImage, 0, 0, canvas.width, canvas.height);

        // Aplicar uma opacidade sobre a imagem
        context.globalAlpha = 0.15;
        context.fillStyle = "#04D600"; // Cor para "join"
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.globalAlpha = 0.3;
        context.fillStyle = "#000000";
        context.save();
        context.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 14);
        context.fill();
        context.restore();

        context.globalAlpha = 1; // Redefinir a opacidade para 100%

        const avatar = await loadImage(member.user.displayAvatarURL({ size: 256 }));

        context.save();
        context.beginPath();
        context.arc(113, 100, 74, 0, Math.PI * 2);
        context.clip();
        context.drawImage(avatar, 39, 26, 148, 148);
        context.restore();

        const actionIconPath = join(__dirname, "../../../assets/icons/crab-svgrepo-com.svg");
        const actionIcon = await loadImage(actionIconPath);
        context.drawImage(actionIcon, 234, 53, 50, 50);

        context.fillStyle = "#FFFFFF";
        context.font = "32px 'Strong Young'";
        context.textBaseline = "middle";
        context.fillText(actionText, 237, 116);

        const { displayName } = member;
        let fontSize = 60;
        do {
            context.font = `bold ${--fontSize}px 'AlienCaret'`;
        } while (context.measureText(displayName).width > canvas.width - 300);
        context.fillText(displayName, 284, 73);

        // Converter o Canvas para um buffer de imagem
        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'welcome-image.png' });

        // Enviar a imagem diretamente no canal
        await channel.send({ files: [attachment] });
        console.log('Mensagem de boas-vindas enviada para o canal:', channel.name); // Log de depuração
    }
});
