import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, Integration, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";
import { RawMessageButtonInteractionData } from "discord.js/typings/rawDataTypes";

interface ComandProps{
    client: ExtendedClient,
    interaction: CommandInteraction,
    options: CommandInteractionOptionResolver
}

export type ComponentsButton = Collection<string,(interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string,(interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string,(interaction: ModalSubmitInteraction) => any>

interface CommandComponets {
    buttons?: ComponentsButton;
    selects?: ComponentsSelect;
    modals?: ComponentsModal;
}

export type CommandType = ApplicationCommandData & CommandComponets & {
    run(props: ComandProps): any
}

export class Command {
    constructor(options: CommandType){
        options.dmPermission = false;
        Object.assign(this, options)
    }
}