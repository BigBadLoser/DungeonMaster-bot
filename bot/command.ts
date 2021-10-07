const fsT = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const {SlashCommandBuilder} = require('@discordjs/builders');

import { CommandList } from './commands/_CommandList';
const commands = [];

/*
 * HELPER FUNCTION THAT REGISTERS OUR COMMANDS TO DISCORD.
 * THIS ONE REGISTERS THEM LOCALLY, IN MY TEST SERVER (DEFINED IN CONFIG.JSON)
 */

for (const c of CommandList) {
	let newCommand = new SlashCommandBuilder().setName(c.name).setDescription(c.description)
	console.log(c.name)
	commands.push(newCommand.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);