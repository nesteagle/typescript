// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
//     console.log(e.detail.name,e.detail.attack);

// }) as EventListener);   event framework
import { MeleeWarrior } from "./entity";
import { LaneArrow } from "./lane";
let lane = new LaneArrow(1);
window.addEventListener("keydown", KeyInput, false);
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let entities: Array<any> = [
  new MeleeWarrior(0, 100, "left"),
  new MeleeWarrior(800, 100, "right"),
];
function tick() {
  lane.draw();
  for (let units in entities) {
    let currentUnit = entities[units];
    for (let j: number = 0; j < entities.length; j++) {
      entities[j].draw();
      entities[j].move();
      if (
        Math.abs(currentUnit.x - entities[j].x) <= currentUnit.range &&
        entities[j] !== currentUnit
      ) {
        //handle class type- aka Melee type or Ranged type
        //console.log("attackable", currentUnit); //debug
      }
      if (entities[j].x < -25 || entities[j].x > canvas.width + 25) {
        entities.splice(entities.indexOf(entities[j]), 1);
        console.log("deleted");
      }
    }
  }
}
function update(): void {
  window.requestAnimationFrame(update);
  context.clearRect(0, 0, canvas.width, canvas.height);
  tick();
}
update();

function KeyInput(event: KeyboardEvent) {
  switch (event.key) {
    case "Up":
    case "ArrowUp":
      console.log("up");
      lane.move("up");
      break;
    case "Down":
    case "ArrowDown":
      console.log("down");
      lane.move("down");
      break;
    default:
  }
}
