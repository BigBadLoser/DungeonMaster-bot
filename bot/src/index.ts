const fs = require('fs');
const { Client, Collection, Intents, Message } = require('discord.js');
const { token } = require('../config.json');
import { onMessage } from '../events/onMessage';
import { onInteractionCreate } from '../events/onInteractionCreate';
import {Party} from '../logic/Party';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvulsilribugjdhblgfk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzU4MDcyMSwiZXhwIjoxOTQ5MTU2NzIxfQ.mxYI2iwk8i3J4DBl_MXK5S9ze6ikGeJiPZ9qMDMIIjY'
const supabase = createClient(supabaseUrl, supabaseKey)

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

global.party = new Party();

client.once('ready', () => {
	var Args = process.argv.slice(2);
	if (Args[0] == "--c"){
		require('child_process').fork('./command.ts');
	}
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if(interaction.isCommand()) {
		await onInteractionCreate(interaction, interaction.client);
	}
});

client.on('message', async message => {
    await onMessage(message, client.user!.id, client);
  });

client.login(token);