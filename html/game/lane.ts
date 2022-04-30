const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
export class LaneArrow {
  public x: number;
  public y: number;
  public lane: number;
  constructor(lane, x?, y?) {
    this.lane = lane;
    this.x = 50;
    this.y = this.lane * 90 + 150;
  }
  move(direction): void {
    if (direction == "up" && this.lane !== 1) this.lane -= 1;
    if (direction == "down" && this.lane !== 7) this.lane += 1;
    this.y = this.lane * 90 + 150;
    console.log(this.lane, direction, this.y);
  }
  draw(): void {
    context.fillRect(this.x, this.y, 50, 30);
    context.beginPath();
    context.moveTo(this.x + 50, this.y - 15);
    context.lineTo(this.x + 80, this.y + 15);
    context.lineTo(this.x + 50, this.y + 45);
    context.lineTo(this.x + 50, this.y - 15);
    context.fill();
  }
}
