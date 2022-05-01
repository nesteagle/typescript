const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let image = document.getElementById("source2") as CanvasImageSource;

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
    public state?: string
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
    context.fillRect(this.x + 12, this.y + 12, 24, 50);
  }
  wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
}
export class Projectile {
  constructor(
    public x: number,
    public y: number,
    public range: number,
    public parent: object,
    public velocity?: number
  ) {
    this.x = x;
    this.y = y - 15;
    this.range = range;
    this.parent = parent;
    this.velocity = range / 15;
  }
  draw(): void {
    context.drawImage(image, this.x, this.y);
    // context.fillStyle = "rgb(60,45,30)";
    // context.fillRect(this.x, this.y + 2, 40, 6);
    // context.beginPath();
    // context.fillStyle = "rgb(80,80,80)";
    // context.moveTo(this.x + 40, this.y - 2);
    // context.lineTo(this.x + 60, this.y + 5);
    // context.lineTo(this.x + 40, this.y + 12);
    // context.lineTo(this.x + 40, this.y - 2);
    // context.moveTo(this.x, this.y + 2);
    // context.lineTo(this.x, this.y + 8);
    // context.lineTo(this.x - 4, this.y + 13);
    // context.lineTo(this.x - 12, this.y + 13);
    // context.lineTo(this.x - 9, this.y + 5);
    // context.lineTo(this.x - 12, this.y - 3);
    // context.lineTo(this.x - 4, this.y - 3);
    // context.lineTo(this.x, this.y + 2);
    // context.fill(); //replace this with image asset later
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
    public state?: string
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state);
    this.range = 50;
    this.speed = 0.6;
    this.health = 150;
    this.strength = 20;
    this.type = "Melee";
    this.name = "Swordsman";
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";

      this.wait(400).then(() => {
        otherUnit.health -= this.strength;
        this.team == "left"
          ? (otherUnit.x += this.strength / 4)
          : (otherUnit.x -= this.strength / 4);
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
    public state?: string
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state);
    this.range = 80;
    this.speed = 1;
    this.health = 100;
    this.strength = 15;
    this.type = "Melee";
    this.name = "Spearman";
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(200).then(() => {
        otherUnit.health -= this.strength; //delayed 0.4 seconds as there will be animations, this can be a hidden stat
        this.team == "left"
          ? (otherUnit.x += this.strength / 2)
          : (otherUnit.x -= this.strength / 2);
      });
      this.wait(1000).then(() => {
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
    public hasHit?: boolean
  ) {
    super(x, y, team, health, speed, armor, strength, range, name, type, state);
    this.range = 450;
    this.speed = 0.4;
    this.health = 100;
    this.strength = 25;
    this.type = "Ranged";
    this.name = "Archer";
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(500).then(() => {
        otherUnit.health -= this.strength; //delayed 0.4 seconds as there will be animations, this can be a hidden stat
        //REWORK THIS SO RNG IS INCLUDED
        this.hasHit = true;
        this.team == "left"
          ? (otherUnit.x += this.strength / 3)
          : (otherUnit.x -= this.strength / 3);
      });
      this.wait(3000).then(() => {
        this.state = "move";
        this.hasHit = false;
      });
    }
  }
}
