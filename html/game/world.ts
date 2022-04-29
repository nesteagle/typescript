// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
//     console.log(e.detail.name,e.detail.attack);

// }) as EventListener);   event framework
import {MeleeWarrior} from "./entity"
let canvas=document.getElementById("canvas") as HTMLCanvasElement;
let context=canvas.getContext("2d") as CanvasRenderingContext2D;
let entities:Array<any>=[new MeleeWarrior(100,100),new MeleeWarrior(150,100)];
function detectAttacks(){
    for (let units in entities){
        let currentUnit=entities[units]
        for (let j:number=0;j<entities.length;j++){
            if (Math.abs(currentUnit.x-entities[j].x)<=currentUnit.range && entities[j]!==currentUnit){
                //handle class type- aka Melee type or Ranged type
            }
        }
    };
}
function update():void{
    window.requestAnimationFrame(update);
    context.clearRect(0, 0, canvas.width, canvas.height);
    detectAttacks()
}
update();

