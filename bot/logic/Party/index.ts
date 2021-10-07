import { User } from 'discord.js';

export class Party {
    members: Array<User> = [];

    add(u : User) : void{
        this.members.push(u);
    }

    getAll(){
        return this.members;
    }
    getPartyOutput() : String {
        return this.members.join(" , ");
    }

    getOne(i){
        return this.members.find(e => e.id === i);
    }
    getDamagePerTick() : number{
        return 10;
    }
}