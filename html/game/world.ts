import { Swordsman, Spearman, Archer, Axeman, Halberdier, MountedSpearman, Projectile } from "./entity";
import { LaneArrow, ScoreBar, CooldownBar, Text } from "./gameobjects";
import { upgrades } from "./menu"; //CHANGE TO EQUIP LAYOUT SOMETIME
let lane = new LaneArrow(1);
let box: any, enemybox: any;
let score: number = 50;
let eventListener: any = document.getElementById("listener");
export let customEvent = new CustomEvent("event");
eventListener.addEventListener(
  "event",
  function () {
    selectable = [Spearman, Swordsman];
    enemyselectable = [Spearman, Swordsman, Archer];
    for (let i = 4; i < upgrades.length; i++) {
      switch (upgrades[i][0]) {
        case "Archery":
          selectable.push(Archer);
          cooldownTable.push(1.5);
          break;
        case "Polearms":
          selectable.push(Halberdier);
          cooldownTable.push(1.6);
          break;
        case "Axes":
          selectable.push(Axeman);
          cooldownTable.push(1.6);
          break;
        case "Horsemanship":
          selectable.push(MountedSpearman);
          cooldownTable.push(1);
          break;
      }
    }
    box = new Text(10, 100, "", "25px Georgia", false, "start", "hanging");
    enemybox = new Text(canvas.width - 10, 100, "", "25px Georgia", false, "end", "hanging");
    for (let i = 0; i < selectable.length; i++) {
      cooldownbars.push([new CooldownBar(), -90]);
    }
    for (let j = 0; j < enemyselectable.length; j++) {
      enemycooldownbars.push([new CooldownBar(), -90]);
    }
    update();
  }.bind(this)
);
window.addEventListener("keydown", KeyInput, false);
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let entities: Array<any> = [];
let cooldownbars: Array<any> = [];
let enemycooldownbars: Array<any> = [];
let projectiles: Array<any> = [];
let scoreBar = new ScoreBar();
let selectable: Array<any> = [];
let enemyselectable: Array<any> = [];
let cooldownTable: Array<number> = [2.3, 1.7, 1.5]; //FIND SOLUTION TO ENEMY COOLDOWN
let laneWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0];
let enemyWeight: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0];
let selected: number = 0;
let enemySelected: number = 0;
let canSpawn: boolean = false;
let enemyCanSpawn: boolean = false;
let windowID: number;
let paused: boolean;
function update(): void {
  windowID = window.requestAnimationFrame(update);
  context.save();
  context.fillStyle = "black";
  lane.draw();
  scoreBar.draw(score);
  checkEnemy();
  updateProjectiles();
  updateEntities();
  updateCooldown();
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
        entities.push(new selectable[selected](-25, lane.y + 15, "left"));
        laneWeight[lane.lane] += entities[entities.length - 1].weight;
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
    case "p":
      if (paused === true) {
        windowID = window.requestAnimationFrame(update);
        paused = false;
      } else {
        let pausedText = new Text(canvas.width / 2, canvas.height / 2, "Paused", "50px Georgia", false, "center", "middle"); //create screen here
        pausedText.draw();
        window.cancelAnimationFrame(windowID);
        paused = true;
      }
      console.log(paused);
      break;
    default:
  }
}
function updateProjectiles(): void {
  for (let i in projectiles) {
    projectiles[i].lifetime -= 1;
    let angle: number = projectiles[i].triangulate(projectiles[i].xv, projectiles[i].yv);
    projectiles[i].angle = angle;
    projectiles[i].xv *= 0.98;
    projectiles[i].yv += 0.09;
    projectiles[i].x += projectiles[i].xv;
    projectiles[i].y += projectiles[i].yv;
    projectiles[i].draw();
    for (let j in entities) {
      if (
        Math.abs(projectiles[i].x - entities[j].x) < 15 &&
        Math.abs(projectiles[i].y - entities[j].y) < 19.5 &&
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
    if (currentUnit) {
      currentUnit.move();
      currentUnit.draw();
    } else continue;
    if (currentUnit.health <= 0) {
      if (currentUnit.team == "left") {
        entities.splice(entities.indexOf(currentUnit), 1);
        laneWeight[currentUnit.lane] -= entities[units].weight;
        continue;
      }
      if (currentUnit.team == "right") {
        entities.splice(entities.indexOf(currentUnit), 1);
        enemyWeight[currentUnit.lane] -= entities[units].weight;
        continue;
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
          let direction: number;
          currentUnit.team == "left" ? (direction = currentUnit.range / 15) : (direction = -currentUnit.range / 15);
          projectiles.push(
            new Projectile(currentUnit.x, currentUnit.y, currentUnit.range, currentUnit, currentUnit.lane, Math.random() * -5 + 1.5, direction)
          );
        }
        currentUnit.attack(entities[j]);
        continue;
      }
      if (entities[j].x < -50) {
        if (entities[j].team == "right") enemyWeight[entities[j].lane]--;
        entities.splice(entities.indexOf(entities[j]), 1);
        score -= entities[j].weight;
        continue;
      }
      if (entities[j].x > canvas.width + 50) {
        if (entities[j].team == "left") laneWeight[entities[j].lane]--;
        entities.splice(entities.indexOf(entities[j]), 1);
        score += entities[j].weight;
        continue;
      }
    }
  }
}
function checkScore(): void {
  if (score > 100) {
    alert("LEFT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID); //return to menu here
  }
  if (score < 0) {
    alert("RIGHT SIDE VICTORY!");
    window.cancelAnimationFrame(windowID); //return to menu here
  }
}
function checkEnemy(): void {
  let clone = [...laneWeight];
  const heaviest = clone.sort((a, b) => b - a);
  if (heaviest[0] == 0) {
    //MAYBE Math.random to select a random opening..?
    if (enemyCanSpawn == true) {
      enemySelected = Math.round(Math.random()); //enemy selects a random unit between 0 and 1
      let random = Math.round(Math.random() * 7 + 1);
      entities.push(new enemyselectable[enemySelected](1225, random * 80 + 200, "right"));
      enemyWeight[random] += entities[entities.length - 1].weight;
      enemyCanSpawn = false;
      for (let k = 0; k < enemycooldownbars.length; k++) {
        enemycooldownbars[k][1] = -90;
      }
      return;
    }
  }
  for (let i = 0; i < laneWeight.length; i++) {
    for (let j = 0; j < laneWeight.length; j++) {
      if (heaviest[i] == 0) {
      } else if (laneWeight[j] == heaviest[i]) {
        if (laneWeight[j] > enemyWeight[j]) {
          enemySelected = calculatePriorities(laneWeight, j);
          if (enemyCanSpawn == true) {
            entities.push(new enemyselectable[enemySelected](1225, j * 80 + 200, "right"));
            enemyWeight[j] += entities[entities.length - 1].weight;
            enemyCanSpawn = false;
            for (let k = 0; k < enemycooldownbars.length; k++) {
              enemycooldownbars[k][1] = -90;
            }
            return;
          }
        } else {
          if (enemyCanSpawn == true) {
            enemySelected = Math.round(Math.random());
            let random = Math.round(Math.random() * 7 + 1);
            entities.push(new enemyselectable[enemySelected](1225, random * 80 + 200, "right"));
            enemyWeight[random] += entities[entities.length - 1].weight;
            enemyCanSpawn = false;
            for (let k = 0; k < enemycooldownbars.length; k++) {
              enemycooldownbars[k][1] = -90;
            }
            return;
          }
        }
      }
    }
  }
}
function calculatePriorities(heaviest: Array<number>, index: number): number {
  if (heaviest[index] <= 1) {
    return 0;
  } else if (heaviest[index] > 1 && heaviest[index] < 3) {
    return 1;
  } else if (heaviest[index] >= 3) {
    return 2; //more if more units added later
  }
}
function updateCooldown() {
  box.text = selectable[selected].name;
  box.draw();
  enemybox.text = enemyselectable[enemySelected].name;
  enemybox.draw();
  for (let i = 0; i < cooldownbars.length; i++) {
    if (i == selected) {
      cooldownbars[selected][0].draw(i * 60 + 40, 58, 30, cooldownbars[i][1], true);
      cooldownbars[i][1] += cooldownTable[i];
      continue;
    }
    cooldownbars[i][0].draw(i * 60 + 40, 56, 24, cooldownbars[i][1]);
    cooldownbars[i][1] += cooldownTable[i];
    if (cooldownbars[selected][1] >= 270) {
      canSpawn = true;
    }
  }
  for (let j = 0; j < enemycooldownbars.length; j++) {
    if (j == enemySelected) {
      enemycooldownbars[selected][0].draw(canvas.width - j * 60 - 40, 58, 30, enemycooldownbars[j][1], true);
      enemycooldownbars[j][1] += cooldownTable[j];
      continue;
    }
    enemycooldownbars[j][0].draw(canvas.width - j * 60 - 40, 56, 24, enemycooldownbars[j][1]);
    enemycooldownbars[j][1] += cooldownTable[j];
    if (enemycooldownbars[enemySelected][1] >= 270) {
      enemyCanSpawn = true;
    }
  }
}
