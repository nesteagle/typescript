import { upgrades } from "./menu";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let arrow = document.getElementById("source2") as CanvasImageSource;
abstract class Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {}
  move(): void {
    if (this.state !== "attack") {
      if (this.team == "left") {
        this.x += this.speed;
      } else if (this.team == "right") {
        this.x -= this.speed;
      }
      this.state = "move";
    }
  }
  draw(): void {
    if (this.name == "Swordsman") context.fillStyle = "rgb(0,0,0)";
    if (this.name == "Spearman") context.fillStyle = "rgb(64,64,64)";
    if (this.name == "Archer") context.fillStyle = "rgb(0,0,128)";
    if (this.name == "Axeman") context.fillStyle = "rgb(128,0,0)";
    if (this.name == "Halberdier") context.fillStyle = "rgb(0,64,64)";
    if (this.name == "MountedSpearman") context.fillStyle = "rgb(64,0,64)";
    context.fillRect(this.x, this.y - 20, 20, 40);
  }

  wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
}
export class Projectile {
  constructor(
    public x: number,
    public y: number,
    public range: number,
    public parent: object,
    public lane?: number,
    public yv?: number,
    public xv?: number,
    public angle?: number,
    public lifetime?: number
  ) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.parent = parent;
    this.angle = angle;
    this.lane = lane;
    this.lifetime = 60;
  }
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.angle * Math.PI) / 180);
    context.drawImage(arrow, -32, -32, 64, 64);
    context.restore();
  }
  triangulate(xv: number, yv: number): number {
    return (Math.atan2(2 * xv, 2 * -yv) * 180) / Math.PI;
  }
}
export class Swordsman extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 50;
    this.speed = 4;
    this.health = 140;
    this.strength = 20;
    this.armor = 5;
    if (this.team == "left") {
      if (isUpgraded("Swords") !== 0) {
        this.strength += isUpgraded("Swords") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 4;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.weight = 1;
    this.type = "Melee";
    this.name = "Swordsman";
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(400).then(() => {
        this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
        this.team == "left" ? (otherUnit.x += this.strength / 4) : (otherUnit.x -= this.strength / 4);
      });
      this.wait(1000).then(() => {
        this.state = "move";
      });
    }
  }
}
export class Spearman extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 80;
    this.speed = 7;
    this.health = 100;
    this.strength = 15;
    this.armor = 0;
    if (this.team == "left") {
      if (isUpgraded("Spears") !== 0) {
        this.strength += isUpgraded("Spears") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 4;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.weight = 1;
    this.type = "Melee";
    this.name = "Spearman";
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(200).then(() => {
        this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
        this.team == "left" ? (otherUnit.x += this.strength / 4) : (otherUnit.x -= this.strength / 4);
      });
      this.wait(1500).then(() => {
        this.state = "move";
      });
    }
  }
}
export class Axeman extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 45;
    this.speed = 0.64;
    this.health = 120;
    this.strength = 25;
    this.armor = 5;
    if (this.team == "left") {
      if (isUpgraded("Axes") !== 0) {
        this.strength += isUpgraded("Axes") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 4;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.weight = 2;
    this.type = "Melee";
    this.name = "Axeman";
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(400).then(() => {
        this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
        this.team == "left" ? (otherUnit.x += this.strength / 3) : (otherUnit.x -= this.strength / 3);
      });
      this.wait(1000).then(() => {
        this.state = "move";
      });
    }
  }
}
export class Halberdier extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 75;
    this.speed = 0.5;
    this.health = 130;
    this.strength = 25;
    this.armor = 5;
    if (this.team == "left") {
      if (isUpgraded("Polearms") !== 0) {
        this.strength += isUpgraded("Polearms") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 4;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.weight = 2;
    this.type = "Melee";
    this.name = "Halberdier";
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(400).then(() => {
        this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
        this.team == "left" ? (otherUnit.x += this.strength / 2) : (otherUnit.x -= this.strength / 2);
      });
      this.wait(2000).then(() => {
        this.state = "move";
      });
    }
  }
}
export class MountedSpearman extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 75;
    this.speed = 1.2;
    this.health = 130;
    this.strength = 20;
    this.armor = 5;
    if (this.team == "left") {
      if (isUpgraded("Horsemanship") !== 0) {
        this.strength += isUpgraded("Horsemanship") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 5;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.weight = 4;
    this.type = "Melee";
    this.name = "MountedSpearman";
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(400).then(() => {
        this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
        this.team == "left" ? (otherUnit.x += this.strength / 2) : (otherUnit.x -= this.strength / 2);
      });
      this.wait(900).then(() => {
        this.state = "move";
      });
    }
  }
}
export class Archer extends Entity {
  constructor(
    public x: number,
    public y: number,
    public team: string,
    public health?: number,
    public speed?: number,
    public armor?: number,
    public strength?: number,
    public range?: number,
    public name?: string,
    public type?: string,
    public state?: string,
    public lane?: number,
    public hasHit?: boolean,
    public weight?: number
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state, lane, weight);
    this.range = 450;
    this.speed = 0.3;
    this.health = 100;
    this.strength = 25;
    this.armor = 0;
    if (this.team == "left") {
      if (isUpgraded("Archery") !== 0) {
        this.strength += isUpgraded("Archery") * 5;
      }
      if (isUpgraded("Speed") !== 0) {
        this.speed += isUpgraded("Speed") / 4;
      }
      if (isUpgraded("Armor") !== 0) {
        this.armor += isUpgraded("Armor") * 2.5;
      }
    }
    this.type = "Ranged";
    this.name = "Archer";
    this.weight = 3;
    this.lane = (this.y - 200) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(600).then(() => {
        if (this.hasHit == true) {
          this.strength <= otherUnit.armor ? (otherUnit.health -= 1) : (otherUnit.health -= this.strength - otherUnit.armor);
          this.team == "left" ? (otherUnit.x += this.strength / 3) : (otherUnit.x -= this.strength / 3);
        }
      });
      this.wait(3000).then(() => {
        this.state = "move";
        this.hasHit = false;
      });
    }
  }
}
function isUpgraded(upgrade) {
  for (let i = 0; i < upgrades.length; i++) {
    if (upgrades[i][0] == upgrade) {
      return upgrades[i][1];
    }
  }
  return 0;
}
