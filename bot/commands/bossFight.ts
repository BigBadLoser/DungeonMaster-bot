import { Command } from '../interfaces/Command';
import {Party } from '../logic/party'
import { TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import { privateDecrypt, getHashes } from 'crypto';
import { Boss } from '../logic/Boss';
import { waitForDebugger } from 'inspector';
import { setTimeout } from 'timers/promises';

/**
* bossFight command
* @param interaction
*/

let mspt = 2000; //the amount of MilliSeconds Per Tick to be used in our main loop.
let startDelay = 10000; //the delay between the party queue closing and the boss spawning

export const bossFight: Command = {
	name: 'bossfight',
    description: 'Starts a new boss fight',

	run: async (interaction, args) => {
        const c = interaction.channel;
        //Sends message asking to form a party.
        interaction.reply(`**${interaction.user.username} has called for a boss fight... Who is brave enough to join?**`);
        //defines a button (inside an 'ActionRow') to be added to the next message
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('jtf')
                .setLabel('Join the fight!')
                .setStyle('DANGER'),
        );
        //created a second button, this one is 'disabled'.
        const afterRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('jtf')
                .setLabel('Party closed')
                .setStyle('DANGER')
                .setDisabled(true)
        );

        //sends a message with custom contents and also attaches our buttonrow from above
        let boss = new Boss(10000); //creates a new boss object with 10k hp
        c.send({embeds: [boss.getEmbed()]}); //sends our boss 'image' card

        const i = await interaction.channel.send({ content: "Click the button below to queue up for this boss battle.", components: [row] });

        //This is a bit of a hack.. but I get the id of ^^ that message and create an event listener (collector) on it
        let m = await interaction.channel.messages.fetch(i.id);
        const collector = m.createMessageComponentCollector({ componentType: 'BUTTON', time: 6000 });
        //This event is emitted on collect, aka when someone clicks the button.
        collector.on('collect', i => {
            //We just send a private (ephemeral) message to the user letting them know they have readied up
            i.reply({content:`Prepare for battle ${i.user.username}, you have readied up.`, ephemeral: true});
            handleCollected(); //TEMPORARILY mimics the behavior of a timeout -- for testing.
        }); 
        //This event gets emitted when the collector ends (indicated by the "time" argument we defined on creation.)
        collector.on('end', collected => {
            //handleCollected(); //Uncomment this to only create party and start fight when the timer ends.
            m.edit({ content: "Click the button below to queue up for this boss battle.", components: [afterRow] })
        });


//<----- INVENTORY UI CODE ----->
// TODO: MAKE BUTTOMS EPHEMERAL
// TODO: ADD ACTIONS TO INVENTORY.
//         |_ 1-5 action buttons like a turn based RPG. > DEFAULT ATTACK | > SPECIAL ATTACK | > DEFAULT SPELL | > SPECIAL SPELL | > (maybe run??)
        async function showInventoryUI(healthM){
            let isOpen : boolean = false;
            const invRowC = new MessageActionRow().addComponents(new MessageButton().setCustomId('inv').setLabel('> Open Inventory').setStyle('SUCCESS').setDisabled(false), new MessageButton().setCustomId('invC').setLabel('Close Inventory').setStyle('DANGER').setDisabled(true));
            const invRowO = new MessageActionRow().addComponents(new MessageButton().setCustomId('inv').setLabel('Open Inventory').setStyle('SUCCESS').setDisabled(true), new MessageButton().setCustomId('invC').setLabel('> Close Inventory').setStyle('DANGER').setDisabled(false));
            let h = await c.messages.fetch(healthM.id);
            await h.edit({ content: h.content, components: [invRowC] });
            const collector = h.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });
            collector.on('collect', j => {
                if (!isOpen && j.reply.content === undefined){
                    isOpen = true;
                    console.log("1");
                    h.edit({ content: h.content, components: [invRowO] })
                    j.reply({content: "inventory", ephemeral: true, fetchReply: true});
                }
                else if (!isOpen){
                    console.log("2");
                    isOpen = true;
                    j.editReply({content: "inventory1"});
                    h.edit({ content: h.content, components: [invRowC] })
                }
                else {
                    console.log("3");
                    isOpen = false;
                    j.reply({content: "Inventory closed, on autopilot.", ephemeral: true});
                    h.edit({ content: h.content, components: [invRowC] })
                }
            });
            collector.on('end', collected => {
                //h.edit({ content: h.content, components: [invRow] })
            });
        }



        /*
        * handleCollected()
        * Handles our collected interactions, this is called once our collector is done.
        */
        function handleCollected(){
            collector.collected.each(i => global.party.add(i.user)); //Loop over each user that clicked the ready button and add them to our global party variable
            interaction.channel.send("The party is as follows: " + global.party.getPartyOutput()); //Send a message listing the party
            startBossFight(); 
        }


        /*
        * startBossFight()
        * sets up a game 'tick' type system for dealing damage and handling the boss health.
        */
        async function startBossFight() {
            await c.send(`**${boss.name}**`);
            const healthM = await c.send(boss.getHealthBar());
            await setTimeout(100);
            await showInventoryUI(healthM);

            await setTimeout(startDelay); //adds a little delay between the party closing and the fight starting.

            let bossLoop = setInterval(async function(){ tick() }, mspt); //sets up our main loop, 'ticks' every 2000ms

            //This function gets called every ${mspt}ms (2000) according to our mspt value
            async function tick() {
                 //Tells our boss to tick and also gives it our currenty party. This could probably be done once and then cached, but in the future I may want to write
                 // a basic ai that targets players based on health, weapons, armor, etc -- so live data could be important.
    //TODO: ADD ACTION LOG BELOW BUTTONS AND HEALTH
    //BIGBADLOSER DEALT 15 DAMAGE WITH 'SWORD OF THE DIVINE'
    //BOSS DEALT 15 DAMAGE WITH 'FLAME BREATH'
    //[> OPEN INVENTORY]   [ CLOSE INVENTORY]
                boss.onTick(global.party);
                let healthBar = await c.messages.fetch(healthM.id); 
                healthBar.edit(boss.getHealthBar()); //edits our health bar message to visually lower the bosses health

                if (boss.currentHealth < 0){
                    killBoss();
                    console.log("killed boss");
                }
            }

            function killBoss() {
                clearInterval(bossLoop); //disables ticking
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

