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
  new MeleeWarrior(canvas.width + 45, 203, "right"),
  new MeleeWarrior(canvas.width + 45, 283, "right"),
  new MeleeWarrior(canvas.width + 45, 363, "right"),
  new MeleeWarrior(canvas.width + 45, 443, "right"),
  new MeleeWarrior(canvas.width + 45, 523, "right"),
  new MeleeWarrior(canvas.width + 45, 603, "right"),
  new MeleeWarrior(canvas.width + 45, 683, "right"),
  new MeleeWarrior(canvas.width + 45, 763, "right"),
];
let selected = MeleeWarrior;
let debounce: number = 0;
function tick() {
  lane.draw();
  debounce <= 0 ? (debounce = 0) : (debounce -= 0.01);
  for (let units in entities) {
    let currentUnit = entities[units];
    currentUnit.move();
    currentUnit.draw();
    if (currentUnit.health <= 0) {
      entities.splice(entities.indexOf(currentUnit), 1);
    }
    for (let j: number = 0; j < entities.length; j++) {
      if (
        Math.abs(currentUnit.x - entities[j].x) <= currentUnit.range &&
        entities[j] !== currentUnit &&
        entities[j].team !== currentUnit.team &&
        entities[j].y == currentUnit.y
      ) {
        console.log("attackable", currentUnit); //debug
        currentUnit.attack(entities[j]);
        break;
      }
      if (entities[j].x < -50 || entities[j].x > canvas.width + 50) {
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
    case " ":
      if (debounce == 0) {
        entities.push(new selected(-45, lane.y - 27, "left"));
        debounce = 1.5;
      }
      break;
    case "Left":
    case "ArrowLeft":
      console.log("left");
      break;
    case "Right":
    case "ArrowRight":
      console.log("right");
      break;
    default:
  }
}
