import { ExtendedClient } from "./structs/ExtendedClient";
import { GlobalFonts } from "@napi-rs/canvas";
import { join } from "path";
import config from "./config.json";
import { createChannels } from "./createChannels";

export * from "colors";

// Defina __rootname usando __dirname
const __rootname = __dirname;

// Carregar a fonte 'Strong Young'
GlobalFonts.registerFromPath(join(__rootname, "../assets/fonts/alienware_font_by_naeki_design_d39j8zu.ttf"), 'AlienCaret');

const client = new ExtendedClient();

client.once('ready', async () => {
    console.log(`Logged in as ${client.user!.tag}`);

    // Adicionar log antes de chamar createChannels
    console.log("Chamando createChannels...");
    await createChannels(client);
    console.log("Canais criados (se necessário).");

    console.log("✅ Bot online...");
});

client.start();

export { client, config };
