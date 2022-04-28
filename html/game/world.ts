// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
//     console.log(e.detail.name,e.detail.attack);

// }) as EventListener);   event framework

let canvas=document.getElementById("canvas") as HTMLCanvasElement;
let context=canvas.getContext("2d") as CanvasRenderingContext2D;
let entities={} as Array<any>;
function detectAttacks(){
    for (let units in entities){

    };
}
function update():void{
    window.requestAnimationFrame(update);
    context.clearRect(0, 0, canvas.width, canvas.height);
    detectAttacks()
}
update();

