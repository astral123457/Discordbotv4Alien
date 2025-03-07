import { Client, GatewayIntentBits, ActivityType, PresenceStatusData } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);


    // Exemplo de atualização detalhada de presença
    const presence = {
        status: 'online' as PresenceStatusData,
        activities: [{
            name: 'Playing Solo',
            type: ActivityType.Playing,
            details: 'Competitive',
            state: 'Anunáqui (𒀭𒀀𒉣𒈾',
            assets: {
                large_image: 'unnamed', // largeImageKey como no Rich Presence
                large_text: 'Numbani',
                small_image: 'unnamed', // smallImageKey como no Rich Presence
                small_text: 'Rogue - Level 100'
            },
            party: {
                id: 'ae488379-351d-4a4f-ad32-2b9b01c91657',
                size: [1, 5]
            },
            secrets: {
                join: 'MTI4NzM0OjFpMmhuZToxMjMxMjM='
            },
            timestamps: {
                start: 1507665886,
                end: 1507665886
            }
        }]
    };

    client.user?.setPresence(presence);

    const guild = client.guilds.cache.get(process.env.GUILD_ID as string);
    if (guild) {
        console.log(`Guild found: ${guild.name}`);
    } else {
        console.log('Guild not found');
    }
});

// Substitua 'YOUR_BOT_TOKEN' pelo token do seu bot
client.login(process.env.BOT_TOKEN);
