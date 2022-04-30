const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
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
    context.fillRect(this.x + 12, this.y + 12, 24, 50);
  }
}
export class MeleeWarrior extends Entity {
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
    this.speed = 3;
    this.health = 100;
    this.strength = 20;
    this.type = "Melee";
  }
  attack(otherUnit) {
    if (this.state == "move") {
      this.state = "attack";
      this.team == "left"
        ? (otherUnit.x += this.strength / 2)
        : (otherUnit.x -= this.strength / 2);
      this.wait(60).then(() => {
        otherUnit.health -= this.strength; //replace with this.attack
      });
      this.wait(1000).then(() => {
        this.state = "move";
      });
    }
  }
  private wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
}
export class RangedWarrior extends Entity {
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
    super(x, y, team, health, speed, armor, strength, range, name, type);
    this.type = "Ranged";
  }
  rangeAttack() {}
}
