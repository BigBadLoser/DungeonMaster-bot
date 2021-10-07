export class Boss {
    name : String = "Slime";
    level : number = 1;
    currentHealth : number = 0;
    maxHealth : number = 100;
    description : string = "squish squish"
    rewards : string = "none at the moment."
    challengeRating: number = 1;

    constructor(h) {
        this.maxHealth = h;
        this.currentHealth = this.maxHealth;
    }

    //This function calculates our health bar display based on bosses current stats
    getHealthBar() : String{
        let healthBarString = "```[";
        let maxDashes = 100;
        let dashConvert = this.maxHealth / maxDashes;
        let currentDashes = this.currentHealth / dashConvert;
        let remainingHealth = maxDashes - currentDashes;
    
        if (this.currentHealth > 0){
          for (var i = 0; i <= currentDashes; i++) {
            healthBarString += "|";
          }
          for (var i = 0; i < remainingHealth; i++) {
            healthBarString += " ";
          }
          healthBarString += "]```";
        }
        else {
          healthBarString = "```[ded]```";
        }
    
        return healthBarString;
      }

      //this function is usually called every 'tick', so all live update functions should go here.
      onTick(p) : void {
        this.takeDamage();
        //this.dealDamage();
        //this.doQuicktime();
      }

      takeDamage() : void {
        //this.currentHealth -= global.party.getDamagePerTick();
        this.currentHealth -= this.maxHealth / 60;
      }

      //A function that gets called ONCE after the boss dies but before the object is deleted.
      deathRattle() : void{

      }

      getEmbed() {
        const embed = {
         color: 0x5A8FE6,
         title: this.name,
          image: {
           url: "https://static.wikia.nocookie.net/monstergirlencyclopedia/images/0/00/Slime_0.jpg",
         },
         description: this.description,
         timestamp: new Date(),
         fields: [
            {
              name: "Challenge Rating",
              value: this.challengeRating.toString(),
              inline: true,
            },
            {
             name: "Health",
             value: this.maxHealth.toString(),
             inline: true,
            },
            {
             name: "Rewards",
             value: this.rewards,
             inline: true,
            },
         ],
         footer: {
             text: '© BigBadLoser',
             icon_url: 'https://cdn.discordapp.com/avatars/84908345542049792/c7ef79846f193d52983a5a15801e6159',
         },
     };
 
     return embed;
     }
}
