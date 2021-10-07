import { Command } from '../interfaces/Command';
import {Party } from '../logic/party'
import { TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import { privateDecrypt } from 'crypto';
import { Boss } from '../logic/Boss';

export const bossFight: Command = {
	name: 'bossfight',
	description: 'Starts a new boss fight',
	run: async (interaction, args) => {
        const c = interaction.channel;
        //Sends message asking to form a party.
        interaction.reply(`**${interaction.user.username} has called for a boss fight... Who is brave enough to join?**`);
        //adds a custom button to bottom of the above message
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('jtf')
                .setLabel('Join the fight!')
                .setStyle('DANGER'),
        );
        const i = await interaction.channel.send({ content: "Click the button below to queue up for this boss battle.", components: [row] });

        let m = await interaction.channel.messages.fetch(i.id);
        const collector = m.createMessageComponentCollector({ componentType: 'BUTTON', time: 6000 });
        collector.on('collect', i => {
            i.reply({content:`Prepare for battle ${i.user.username}, you have readied up.`, ephemeral: true});
            handleCollected();
        });

        collector.on('end', collected => {
            //handleCollected(); //Uncomment this to only create party and start fight when the timer ends.
        });

        function handleCollected(){
            collector.collected.each(i => global.party.add(i.user))
            interaction.channel.send("The party is as follows: " + global.party.getPartyOutput());
            startBossFight();
        }



        async function startBossFight() {
            let bossLoop = setInterval(function(){ tick() }, 2000);
            let boss = new Boss(10000);
            const healthM = await c.send(boss.getHealthBar());
            async function tick() {
                boss.onTick(global.party);
                let healthBar = await c.messages.fetch(healthM.id);
                healthBar.edit(boss.getHealthBar());
                if (boss.currentHealth < 0){
                    killBoss();
                }
            }

            function killBoss() {
                clearInterval(bossLoop);
                boss.deathRattle();
            }
        }


/*
        let m = await interaction.channel.messages.fetch(i.id);
        m.react("💩");
        m.awaitReactions({time: 6000}).then(collected => {
            console.log(collected);
                }).catch(() => {
                m.reply('No reaction after 30 seconds, operation canceled');
        });




*/
	}
}

