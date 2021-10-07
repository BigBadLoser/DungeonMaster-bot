import { Command } from "../interfaces/Command";
import { ping } from "./ping";
import { bossFight } from "./bossFight";


export const CommandList: Command[] = [ ping, bossFight ];
