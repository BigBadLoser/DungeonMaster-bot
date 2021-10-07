import { Command } from '../interfaces/Command';



export const ping: Command = {
	name: 'ping',
	description: 'Replies with pong!',
	run: async (interaction, args) => {
		await interaction.reply('Pong!');
	}
}