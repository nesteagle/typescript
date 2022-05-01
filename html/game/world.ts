// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
//     console.log(e.detail.name,e.detail.attack);

// }) as EventListener);   event framework
import { Swordsman, Spearman, Archer, Projectile } from "./entity";
import { LaneArrow, ScoreBar } from "./gameobjects";
let lane = new LaneArrow(1);
let score: number = 50;
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
let projectiles: Array<any> = [];
let selectable: Array<any> = [Swordsman, Spearman, Archer];
let selected: number = 0;
let debounce: number = 0;
let bar = new ScoreBar();

function update(): void {
  window.requestAnimationFrame(update);
  context.save();
  context.fillStyle = "black";
  lane.draw();
  bar.draw(score);
  updateProjectiles();
  updateEntities();
  debounce <= 0 ? (debounce = 0) : (debounce -= 0.01);
  context.restore();
}
update();

function KeyInput(event: KeyboardEvent) {
  switch (event.key) {
    case "Up":
    case "ArrowUp":
      lane.move("up");
      break;
    case "Down":
    case "ArrowDown":
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
function updateProjectiles(): void {
  for (let i in projectiles) {
    let angle: number = projectiles[i].triangulate(
      projectiles[i].xv,
      projectiles[i].yv
    );
    projectiles[i].angle = angle;
    projectiles[i].xv *= 0.97;
    projectiles[i].x += projectiles[i].xv;
    projectiles[i].y += projectiles[i].yv;
    projectiles[i].yv += 0.1;
    projectiles[i].lifetime -= 1;
    projectiles[i].draw();
    if (projectiles[i].lifetime <= 0) {
      projectiles.splice(projectiles[i], 1);
      console.log("deleted");
    }
  }
}
function updateEntities() {
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
        if (currentUnit.name == "Archer" && currentUnit.state == "move") {
          projectiles.push(
            new Projectile(
              currentUnit.x + 12,
              currentUnit.y + 20,
              currentUnit.range * 1.5,
              currentUnit,
              Math.random() * -5 + 1.5
            )
          );
        }
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
