const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
abstract class Entity{
    constructor(
        public x:number,
        public y:number,
        public team:string,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string,
        public type?:string
        ){}
    move():void{
        if (this.team=="left"){
            this.x+=this.speed;
        } else if (this.team=="right"){
            this.x-=this.speed;
        }
    }
    draw():void{
        context.fillRect(this.x+12,this.y+15,24,50)
    }
}
export class MeleeWarrior extends Entity{
    constructor(
        public x:number,
        public y:number,
        public team:string,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string,
        public type?:string
    ){
        super(x,y,team,health,speed,armor,strength,range,name,type);
        this.range=50;
        this.speed=1;
        this.type="Melee";
    }
    attack(){

    }
}
export class RangedWarrior extends Entity{
    constructor(
        public x:number,
        public y:number,
        public team:string,
        public health?:number,
        public speed?:number,
        public armor?:number,
        public strength?:number,
        public range?:number,
        public name?:string,
        public type?:string
    ){
        super(x,y,team,health,speed,armor,strength,range,name,type);
        this.type="Ranged";
    }
    rangeAttack(){

    }
}

