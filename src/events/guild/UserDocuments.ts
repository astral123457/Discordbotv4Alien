import { TextChannel, CategoryChannel, ChannelType, AttachmentBuilder } from 'discord.js';
import { Event } from '../../structs/types/Event';
import config from '../../config.json';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import sharp from 'sharp';
import { join } from 'path'; // Importando join de path

const __rootname = __dirname;

// Carregar as fontes 'Strong Young' e 'AlienCaret'
GlobalFonts.registerFromPath(join(__rootname, "../../../assets/fonts/Strong Young.ttf"), 'Strong Young');
GlobalFonts.registerFromPath(join(__rootname, "../../../assets/fonts/alienware_font_by_naeki_design_d39j8zu.ttf"), 'AlienCaret');

export default new Event({
    name: 'guildMemberRemove',
    run: async (member) => {
        let category = member.guild.channels.cache.find(c => c.name === 'entrada-e-saida' && c.type === ChannelType.GuildCategory) as CategoryChannel;
        if (!category) {
            category = await member.guild.channels.create({
                name: 'entrada-e-saida',
                type: ChannelType.GuildCategory
            }) as CategoryChannel;
        }

        let channel = member.guild.channels.cache.find(ch => ch.name === 'despedidas' && ch.type === ChannelType.GuildText) as TextChannel;
        if (!channel) {
            channel = await member.guild.channels.create({
                name: 'despedidas',
                type: ChannelType.GuildText,
                parent: category.id
            }) as TextChannel;
        }

        // Carregar e desfocar a imagem do banner
        const bannerPath = join(__rootname, "../../../assets/imagens/backgrounds/farewell-banner.png");
        const bannerImageBuffer = await sharp(bannerPath).resize(800, 200).blur(4).toBuffer();
        const bannerImage = await loadImage(bannerImageBuffer);

        // Criar o Canvas e adicionar a imagem
        const canvas = createCanvas(800, 200);
        const context = canvas.getContext("2d");

        context.drawImage(bannerImage, 0, 0, canvas.width, canvas.height);

        // Aplicar uma opacidade sobre a imagem
        context.globalAlpha = 0.15;
        context.fillStyle = "#D60000"; // Cor para "leave"
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

        const actionIconPath = join(__rootname, "../../../assets/icons/dinosaur-svgrepo-com.svg");
        const actionIcon = await loadImage(actionIconPath);
        context.drawImage(actionIcon, 234, 53, 50, 50); // Ajustar o tamanho do ícone para 50x50

        // Texto de despedida com o nome do membro
        context.fillStyle = "#FFFFFF";
        context.font = "32px 'Strong Young'";
        context.textBaseline = "middle";
        const farewellText = `Adeus ${member.displayName}`;
        context.fillText(farewellText, 237, 116);

        const { displayName } = member;
        let fontSize = 60;
        do {
            context.font = `bold ${--fontSize}px 'AlienCaret'`;
        } while (context.measureText(displayName).width > canvas.width - 300);
        context.fillText(displayName, 284, 73);

        // Converter o Canvas para um buffer de imagem
        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'farewell-image.png' });

        // Enviar a imagem diretamente no canal
        await channel.send({ files: [attachment] });
    }
});
