// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
//     console.log(e.detail.name,e.detail.attack);

// }) as EventListener);   event framework
import { Swordsman, Spearman, Archer } from "./entity";
import { LaneArrow } from "./lane";
let lane = new LaneArrow(1);
window.addEventListener("keydown", KeyInput, false);
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let entities: Array<any> = [
  new Swordsman(canvas.width + 45, 253, "right"),
  new Swordsman(canvas.width + 45, 333, "right"),
  new Swordsman(canvas.width + 45, 413, "right"),
  new Swordsman(canvas.width + 45, 493, "right"),
  new Swordsman(canvas.width + 45, 573, "right"),
  new Swordsman(canvas.width + 45, 653, "right"),
  new Swordsman(canvas.width + 45, 733, "right"),
  new Swordsman(canvas.width + 45, 813, "right"),
];
let selectable: Array<any> = [Swordsman, Spearman, Archer];
let selected: number = 0;
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
        //console.log("attackable", currentUnit); //debug
        currentUnit.attack(entities[j]);
        break;
      }
      if (entities[j].x < -50 || entities[j].x > canvas.width + 50) {
        entities.splice(entities.indexOf(entities[j]), 1);
        console.log("deleted");
        break;
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
        entities.push(new selectable[selected](-25, lane.y - 27, "left"));
        debounce = 1.5;
      }
      break;
    case "Left":
    case "ArrowLeft":
      selected == 0 ? (selected = selectable.length - 1) : (selected -= 1);
      console.log(selectable, selected);
      break;
    case "Right":
    case "ArrowRight":
      selected == selectable.length - 1 ? (selected = 0) : (selected += 1);
      console.log(selectable, selected);
      break;
    default:
  }
}
