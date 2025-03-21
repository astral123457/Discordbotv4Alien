import { Collection, ColorResolvable, EmbedBuilder, italic } from "discord.js";
import { Event} from "../../structs/types/Event";
import config from "../../config.json";

const members: Collection<string, number> = new Collection();

export default new Event({
    name: "messageCreate",
    async run(message){
        if(!message.inGuild()) return;
        if(message.author.bot) return;
        if(message.author.id === message.guild.ownerId) return;
        if(message.member?.permissions.has("Administrator")) return;

        const { author, channel, member} =message;

        const count = members.get(author.id);
        if(!count){
            members.set(author.id,1);
            return;
        }
        const newCount = count +1;
        members.set(author.id, newCount);

        if (newCount >= 5){
            members.delete(author.id);
            member?.timeout(60_000, "Flood de mensagens");

            const embed=new EmbedBuilder({
                description: `${author} evite o flood de mesagens repetidas 5 vezes por favor!
                > Leia as regrasdo servidor para evitar punicoes severas
                 ${italic("Voce podera enviar messagens em breve...")}`
            }).setColor(config.colors.red as ColorResolvable)
           
            const message = await channel.send({content: `||${author}||`, embeds: [embed]});
            setTimeout(() => message.delete().catch(() => {}), 60_000);
            return;
        }

        setTimeout(() => {
            const currCount =members.get(author.id);
            if(!currCount)return;
            members.set(author.id, currCount -1);

        },6000)
        

    }

})
