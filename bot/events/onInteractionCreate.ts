import { Client, Message, Interaction } from 'discord.js';
import { CommandList } from '../commands/_CommandList';
import { Command } from '../interfaces/Command';
export const onInteractionCreate = (interaction: Interaction, client: Client) => {
  if (!interaction.isCommand()){
		console.error("No interaction")
		return;
  }

  let t: Command;

  if (CommandList.some(e => e.name === interaction.commandName)){
    let t = CommandList.find(e => e.name === interaction.commandName);
    t.run(interaction);
  }

  

};
