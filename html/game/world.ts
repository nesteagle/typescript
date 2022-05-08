import {
  Swordsman,
  Spearman,
  Archer,
  Axeman,
  Halberdier,
  MountedSpearman,
  Projectile,
} from "./entity";
import { LaneArrow, ScoreBar, CooldownBar } from "./gameobjects";
let lane = new LaneArrow(1);
let score: number = 50;
let eventListener: any = document.getElementById("listener");

export let customEvent = new CustomEvent("event");

eventListener.addEventListener(
  "event",
  function () {
    // change here Event to CustomEvent
    update();
    console.log("updated");
  }.bind(this)
);

window.addEventListener("keydown", KeyInput, false);
let listener = document.getElementById("listener");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let entities: Array<any> = [];
let cooldownbars: Array<any> = [];
let projectiles: Array<any> = [];
let scoreBar = new ScoreBar();
let selectable: Array<any> = [
  Spearman,
  Swordsman,
  Archer,
  Axeman,
  Halberdier,
  MountedSpearman,
];
let cooldownTable: Array<number> = [2, 1.7, 1.5, 1.6, 1.5, 1];
let laneWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0];
let enemyWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0];
let enemyCooldown: number = 200;
for (let i = 0; i < selectable.length; i++) {
  cooldownbars.push([new CooldownBar(), -90]);
}
let selected: number = 0;
let canSpawn: boolean = false;
let windowID: number;
function update(): void {
  windowID = window.requestAnimationFrame(update);
  context.save();
  context.fillStyle = "black";
  lane.draw();
  scoreBar.draw(score);
  checkEnemy();
  updateProjectiles();
  updateEntities();
  for (let i = 0; i < cooldownbars.length; i++) {
    if (i == selected) {
      cooldownbars[selected][0].draw(
        i * 65 + 42,
        58,
        32,
        cooldownbars[i][1],
        true
      );
      cooldownbars[i][1] += cooldownTable[i];
      continue;
    }
    cooldownbars[i][0].draw(i * 65 + 42, 56, 26, cooldownbars[i][1]);
    cooldownbars[i][1] += cooldownTable[i];
    if (cooldownbars[selected][1] >= 270) {
      canSpawn = true;
    }
  }
  context.restore();
  checkScore();
}

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
        entities.push(new selectable[selected](-25, lane.y - 16, "left"));
        laneWeight[lane.lane - 1]++;
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
        Math.abs(projectiles[i].y - entities[j].y - 16) < 18 &&
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
    if (currentUnit.health <= 0) {
      if (currentUnit.team == "left") {
        entities.splice(entities.indexOf(currentUnit), 1);
        laneWeight[currentUnit.lane]--;
        break;
      }
      if (currentUnit.team == "right") {
        entities.splice(entities.indexOf(currentUnit), 1);
        enemyWeight[currentUnit.lane]--;
        break;
      }
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
    if (currentUnit) {
      currentUnit.move();
      currentUnit.draw();
    }
  }
}
function checkScore(): void {
  if (score > 100) {
    alert("LEFT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID);
  }
  if (score < 0) {
    alert("RIGHT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID);
  }
}
function checkEnemy(): void {
  enemyCooldown--;
  let clone = [...laneWeight];
  const heaviest = clone.sort((a, b) => b - a);
  if (heaviest[0] == 0) {
    if (enemyCooldown <= 0) {
      let random = Math.round(Math.random() * 7 + 1);
      entities.push(new selectable[0](1225, random * 80 + 184, "right"));
      enemyCooldown = 150;
      enemyWeight[random]++;
      return;
    }
  }
  for (let i = 0; i < laneWeight.length; i++) {
    for (let j = 0; j < laneWeight.length; j++) {
      if (heaviest[i] == 0) {
      } else if (laneWeight[j] == heaviest[i]) {
        if (laneWeight[j] > enemyWeight[j + 1]) {
          if (enemyCooldown <= 0) {
            entities.push(new selectable[0](1225, (j + 1) * 80 + 184, "right"));
            enemyCooldown = 150;
            enemyWeight[j + 1]++;
            break;
          }
        } else if (laneWeight[j] !== enemyWeight[j + 1]) j++;
        else {
          if (enemyCooldown <= 0) {
            let random = Math.round(Math.random() * 7 + 1);
            entities.push(new selectable[0](1225, random * 80 + 184, "right"));
            enemyCooldown = 150;
            enemyWeight[random]++;
            console.log(random);
            break;
          }
        }
      }
    }
  }
}
