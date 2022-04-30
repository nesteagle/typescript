const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
export class LaneArrow {
  public x: number;
  public y: number;
  public lane: number;
  constructor(lane, x?, y?) {
    this.lane = lane;
    this.x = 25;
    this.y = this.lane * 80 + 150;
  }
  move(direction): void {
    if (direction == "up" && this.lane !== 1) this.lane -= 1;
    if (direction == "down" && this.lane !== 8) this.lane += 1;
    this.y = this.lane * 80 + 150;
    console.log(this.lane, direction, this.y);
  }
  draw(): void {
    context.fillStyle = "rgb(169,0,0)";
    context.fillRect(this.x, this.y, 30, 20);
    context.beginPath();
    context.moveTo(this.x + 30, this.y - 10);
    context.lineTo(this.x + 50, this.y + 10);
    context.lineTo(this.x + 30, this.y + 30);
    context.lineTo(this.x + 30, this.y - 10);
    context.fill();
    context.fillStyle = "black";
  }
}
