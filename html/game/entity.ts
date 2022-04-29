abstract class Entity{
    constructor(
        public x:number,
        public y:number,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string,
        public type?:string
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
        public name?:string,
        public type?:string
    ){
        super(x,y,health,speed,armor,strength,range,name,type);
        this.range=50;
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
        public name?:string,
        public type?:string
    ){
        super(x,y,health,speed,armor,strength,range,name,type);
    }
    rangeAttack(){

    }
}

