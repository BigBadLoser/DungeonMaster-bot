export class Boss {
    private name : String = "Slime";
    private level : number = 1;
    currentHealth : number = 0;
    private maxHealth : number = 100;

    constructor(h) {
        this.maxHealth = h;
        this.currentHealth = this.maxHealth;
    }
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

      onTick(p) : void {
        this.takeDamage();
      }

      takeDamage() : void {
        this.currentHealth -= this.maxHealth / 10;
      }

      deathRattle() : void{

      }
}
