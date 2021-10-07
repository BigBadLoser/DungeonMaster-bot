import { Client, Message } from 'discord.js';
import { CommandList } from '../commands/_CommandList';

export const onMessage = (message: Message, id: string, client: Client) => {
  
  const prefix = '!';
  if (message.author.id === id) return;

  const args = message.content.trim().split(" ");
  for (const Command of CommandList) {
    if (args[0].toLowerCase() === prefix + Command.name.toLowerCase()) {
      Command.run(message);
      break;
    }
  }
};
