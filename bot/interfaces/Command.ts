import { Message, Interaction } from 'discord.js';
//Templates our command structure
export interface Command {
  name: string;
  description: string;
  run: (...args) => Promise<void>;
};

