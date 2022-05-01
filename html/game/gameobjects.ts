const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let image = document.getElementById("source") as CanvasImageSource;

export class LaneArrow {
  public x: number;
  public y: number;
  public lane: number;
  constructor(lane, x?, y?) {
    this.lane = lane;
    this.x = 25;
    this.y = this.lane * 80 + 200;
  }
  move(direction): void {
    if (direction == "up" && this.lane !== 1) this.lane -= 1;
    if (direction == "down" && this.lane !== 8) this.lane += 1;
    this.y = this.lane * 80 + 200;
    console.log(this.lane, direction, this.y);
  }
  draw(): void {
    context.drawImage(image, 0, 0);
    context.fillStyle = "rgb(169,0,0)";
    context.fillRect(this.x, this.y, 30, 20);
    context.beginPath();
    context.moveTo(this.x + 30, this.y - 10);
    context.lineTo(this.x + 50, this.y + 10);
    context.lineTo(this.x + 30, this.y + 30);
    context.lineTo(this.x + 30, this.y - 10);
    context.fill();
  }
}
export class ScoreBar {
  draw(score: number): void {
    context.fillStyle = "rgb(32,32,128)";
    context.fillRect(0, 0, score * 12, 15);
    context.fillStyle = "rgb(128,32,32)";
    context.fillRect(score * 12, 0, canvas.width - score * 12, 15);
  }
}
