// import {div} from "./entity"
// attackEvent.detail.name="Swordsman"
// attackEvent.detail.attack=15
// div.dispatchEvent(attackEvent)
// div.addEventListener('attack', ((e:CustomEvent) => {
// }) as EventListener);   event framework
import { Swordsman, Spearman, Archer, Projectile } from "./entity";
import { LaneArrow, ScoreBar, CooldownBar } from "./gameobjects";
let lane = new LaneArrow(1);
let score: number = 50;
window.addEventListener("keydown", KeyInput, false);
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let entities: Array<any> = [];
let cooldownbars: Array<any> = [];
let projectiles: Array<any> = [];
let selectable: Array<any> = [Swordsman, Spearman, Archer];
let cooldownTable: Array<number> = [1.5, 2, 1.5]; //save stats elsewhere later
let laneWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0];
let enemyWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0]; //only because swordsmen spawn in entities- line 15
let enemyCooldown: number = 150;
for (let i = 0; i < selectable.length; i++) {
  cooldownbars.push([new CooldownBar(), -90]);
}
let selected: number = 0;
let canSpawn: boolean = false;
let windowID: number;
let bar = new ScoreBar();
function update(): void {
  windowID = window.requestAnimationFrame(update);
  context.save();
  context.fillStyle = "black";
  lane.draw();
  bar.draw(score);
  checkEnemy();
  updateProjectiles();
  updateEntities();
  for (let i = 0; i < cooldownbars.length; i++) {
    if (i == selected) {
      cooldownbars[selected][0].draw(
        i * 80 + 48,
        64,
        40,
        cooldownbars[i][1],
        true
      );
      cooldownbars[i][1] += cooldownTable[i];
      continue;
    }
    cooldownbars[i][0].draw(i * 80 + 48, 64, 32, cooldownbars[i][1]);
    cooldownbars[i][1] += cooldownTable[i];
    if (cooldownbars[selected][1] == 270) {
      canSpawn = true;
    }
  }
  context.restore();
  checkScore();
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
      if (canSpawn == true) {
        entities.push(new selectable[selected](-25, lane.y - 25, "left"));
        laneWeight[lane.lane]++;
        canSpawn = false;
        for (let i = 0; i < cooldownbars.length; i++) {
          cooldownbars[i][1] = -90;
        }
      }
      break;
    case "Left":
    case "ArrowLeft":
      selected == 0 ? (selected = selectable.length - 1) : (selected -= 1);
      break;
    case "Right":
    case "ArrowRight":
      selected == selectable.length - 1 ? (selected = 0) : (selected += 1);
      break;
    default:
  }
}
function updateProjectiles(): void {
  for (let i in projectiles) {
    projectiles[i].lifetime -= 1;
    let angle: number = projectiles[i].triangulate(
      projectiles[i].xv,
      projectiles[i].yv
    );
    projectiles[i].angle = angle;
    projectiles[i].xv *= 0.97;
    projectiles[i].x += projectiles[i].xv;
    projectiles[i].y += projectiles[i].yv;
    projectiles[i].yv += 0.09;
    projectiles[i].draw();
    for (let j in entities) {
      if (
        Math.abs(projectiles[i].x - entities[j].x) < 20 &&
        Math.abs(projectiles[i].y - entities[j].y - 25) < 23 &&
        projectiles[i].lane == entities[j].lane &&
        projectiles[i].parent.team !== entities[j].team
      ) {
        projectiles[i].parent.hasHit = true;
        projectiles.splice(projectiles[i], 1);
        break;
      }
    }
    if (projectiles[i] && projectiles[i].lifetime <= 0) {
      projectiles.splice(projectiles[i], 1);
    }
  }
}
function updateEntities() {
  for (let units in entities) {
    let currentUnit = entities[units];
    currentUnit.move();
    currentUnit.draw();
    if (currentUnit.health <= 0) {
      if (currentUnit.team == "left") laneWeight[currentUnit.lane]--;
      entities.splice(entities.indexOf(currentUnit), 1);
    }
    for (let j: number = 0; j < entities.length; j++) {
      if (
        Math.abs(currentUnit.x - entities[j].x) <= currentUnit.range &&
        entities[j] !== currentUnit &&
        entities[j].team !== currentUnit.team &&
        entities[j].lane == currentUnit.lane
      ) {
        if (currentUnit.name == "Archer" && currentUnit.state == "move") {
          projectiles.push(
            new Projectile(
              currentUnit.x + 12,
              currentUnit.y + 20,
              currentUnit.range,
              currentUnit,
              currentUnit.lane,
              Math.random() * -5 + 1.5
            )
          );
        }
        currentUnit.attack(entities[j]);
        break;
      }
      if (entities[j].x < -50) {
        if (entities[j].team == "left") laneWeight[entities[j].lane]--;
        entities.splice(entities.indexOf(entities[j]), 1);
        score -= 1;
        //replace with score weight
        break;
      }
      if (entities[j].x > canvas.width + 50) {
        if (entities[j].team == "left") laneWeight[entities[j].lane]--;
        entities.splice(entities.indexOf(entities[j]), 1);
        score += 1;
        //replace with score weight
        break;
      }
    }
  }
}
function checkScore(): void {
  if (score > 100) {
    console.log("LEFT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID);
  }
  if (score < 0) {
    console.log("RIGHT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID);
  }
}
function checkEnemy(): void {
  enemyCooldown--;
  let temp = [...laneWeight];
  const heaviest = temp.sort((a, b) => b - a);
  for (let i = 0; i < laneWeight.length; i++) {
    if (heaviest[0] == 0) {
      //process
    } else if (laneWeight[i] == heaviest[0]) {
      for (let j = 0; j < laneWeight.length - i; ) {
        if (laneWeight[i + j] > enemyWeight[i + j]) {
          if (enemyCooldown <= 0) {
            console.log(i + j, i, j);
            entities.push(new selectable[0](1225, (i + j) * 80 + 175, "right"));
            enemyCooldown = 150;
            enemyWeight[i + j]++;
            console.log(laneWeight, enemyWeight);
          }
        } else if (enemyWeight[i + j] > laneWeight[i + j]) {
          j++;
        }
        break;
      }
    }
  }
}
