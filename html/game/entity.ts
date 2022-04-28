abstract class Entity{
    constructor(
        public x:number,
        public y:number,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string
        ){}
    move():void{
        console.log(`${this.name} moved with ${this.speed} speed`)
    }
}
export class MeleeWarrior extends Entity{
    constructor(
        public x:number,
        public y:number,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string
    ){
        super(x,y,health,speed,armor,strength,range,name);
    }
    attack(){

    }
}
export class RangedWarrior extends Entity{
    constructor(
        public x:number,
        public y:number,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string
    ){
        super(x,y,health,speed,armor,strength,range,name);
    }
    rangeAttack(){

    }
}

