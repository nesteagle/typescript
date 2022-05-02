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
    public lane?: number
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
    context.fillRect(this.x + 25, this.y + 12, 24, 50);
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
    this.xv = range / 12;
    this.angle = angle;
    this.lane = lane;
    this.lifetime = 60;
  }
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.angle * Math.PI) / 180);
    context.drawImage(arrow, -64, -64);
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
    public lane?: number
  ) {
    super(
      x,
      y,
      team,
      health,
      speed,
      armor,
      strength,
      range,
      name,
      type,
      state,
      lane
    );
    this.range = 50;
    this.speed = 0.6;
    this.health = 150;
    this.strength = 20;
    this.type = "Melee";
    this.name = "Swordsman";
    this.lane = (this.y - 175) / 80;
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
    public state?: string,
    public lane?: number
  ) {
    super(
      x,
      y,
      team,
      health,
      speed,
      armor,
      strength,
      range,
      name,
      type,
      state,
      lane
    );
    this.range = 80;
    this.speed = 1;
    this.health = 100;
    this.strength = 15;
    this.type = "Melee";
    this.name = "Spearman";
    this.lane = (this.y - 175) / 80;
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
    public lane?: number,
    public hasHit?: boolean
  ) {
    super(
      x,
      y,
      team,
      health,
      speed,
      armor,
      strength,
      range,
      name,
      type,
      state,
      lane
    );
    this.range = 450;
    this.speed = 0.4;
    this.health = 100;
    this.strength = 25;
    this.type = "Ranged";
    this.name = "Archer";
    this.lane = (this.y - 175) / 80;
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.wait(600).then(() => {
        if (this.hasHit == true) {
          otherUnit.health -= this.strength; //delayed 0.4 seconds as there will be animations, this can be a hidden stat
          this.hasHit = true;
          this.team == "left"
            ? (otherUnit.x += this.strength / 3)
            : (otherUnit.x -= this.strength / 3);
        }
      });
      this.wait(3000).then(() => {
        this.state = "move";
        this.hasHit = false;
      });
    }
  }
}
