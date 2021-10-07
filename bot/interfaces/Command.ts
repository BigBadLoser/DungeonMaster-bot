import { Message, Interaction } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  run: (...args) => Promise<void>;
};

