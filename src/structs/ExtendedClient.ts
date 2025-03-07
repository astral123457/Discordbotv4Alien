import { Client, Partials, IntentsBitField, BitFieldResolvable, GatewayIntentsString, Collection, ApplicationCommandDataResolvable, Locale, ClientEvents } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { Command, CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import { EventType } from "./types/Event";
dotenv.config();


const fileCondition = (fileName: string) => fileName.endsWith(".ts") || fileName.endsWith(".js");


export class ExtendedClient extends Client{
    public commands: Collection<string, CommandType> = new Collection();
    public buttons: ComponentsButton = new Collection();
    public selects: ComponentsSelect = new Collection();
    public modals: ComponentsModal = new Collection();


    constructor(){
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [
                Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent,
                Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User

            ]
        })
    }
    public start(){
        this.registerModules();
        this.registerEvents();
        this.login(process.env.BOT_TOKEN);

    }
    private registerCommmands(commands: Array<ApplicationCommandDataResolvable>){
        this.application?.commands.set(commands)
        .then(() => {
            console.log("✅ Slash commands (/) defined".green);
        })
        .catch(error => {
            console.log(`❌ An error occurred while trying to set the Slash Commands (/): \n${error}`.red)
        })
    }
    private registerModules() {
        const slashCommads: Array<ApplicationCommandDataResolvable> = new Array();
        const commandsPath = path.join(__dirname, "..", "commands");
    
        fs.readdirSync(commandsPath).forEach(Local => {
            fs.readdirSync(commandsPath + `/${Local}/`).filter(fileCondition).forEach(async fileName => {
                console.log(`Importando comando: ../commands/${Local}/${fileName}`);
                const commandModule = await import(`../commands/${Local}/${fileName}`);
                console.log(`Módulo de comando importado: ${JSON.stringify(commandModule)}`);
    
                if (!commandModule?.default) {
                    console.error(`O módulo de comando padrão está indefinido para o arquivo: ${fileName}`);
                    return;
                }
    
                const command: CommandType = commandModule.default;
                console.log(`Comando: ${JSON.stringify(command)}`.yellow);
    
                if (command) {
                    const { name, buttons, selects, modals } = command;
                    console.log(`Nome do comando: ${name}`.yellow);
    
                    if (name) {
                        this.commands.set(name, command);
                        slashCommads.push(command);
    
                        if (buttons) buttons.forEach((run, key) => this.buttons.set(key, run));
                        if (selects) selects.forEach((run, key) => this.selects.set(key, run));
                        if (modals) modals.forEach((run, key) => this.modals.set(key, run));
                    }
                } else {
                    console.error(`Comando está indefinido para o arquivo: ${fileName}`);
                }
            });
        });
    
        this.on("ready", () => this.registerCommmands(slashCommads));
    }
    
    private registerEvents(){
        const eventsPath =path.join(__dirname, "..", "events");

        fs.readdirSync(eventsPath).forEach(local => {
            fs.readdirSync(`${eventsPath}/${local}`).filter(fileCondition)
            .forEach(async fileName => {
                const {name, once, run}: EventType<keyof ClientEvents> =(await import (`../events/${local}/${fileName}`))?.default

                try {
                    if (name) (once) ? this.once(name, run) : this.on(name, run);

                } catch (error){
                    console.log(`An error occurred on event: ${name} \n${error}`.red);
                }

            })
        })
    }


}