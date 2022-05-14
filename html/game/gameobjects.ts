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
  }
  draw(): void {
    context.drawImage(image, 0, 0);
    context.fillStyle = "rgb(169,0,0)";
    context.fillRect(this.x, this.y, 40, 30);
    context.beginPath();
    context.moveTo(this.x + 40, this.y - 10);
    context.lineTo(this.x + 62, this.y + 15);
    context.lineTo(this.x + 40, this.y + 40);
    context.lineTo(this.x + 40, this.y - 10);
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
export class CooldownBar {
  draw(x: number, y: number, radius: number, percentage: number, selected?: boolean) {
    context.beginPath();
    context.moveTo(x, y);
    selected == true ? (context.fillStyle = "rgba(100,25,10,0.7)") : (context.fillStyle = "rgba(40,40,40,0.7)");
    context.arc(x, y, radius, -Math.PI / 2, (percentage / 180) * Math.PI);
    context.fill();
    context.beginPath();
    context.fillStyle = "black";
    context.lineWidth = 2;
    context.arc(x, y, radius, 0, (360 / 180) * Math.PI);
    context.stroke();
  }
}
export class Text {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public box: boolean,
    public alignment?: any,
    public boxColor?: string
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.box = box;
    this.boxColor = boxColor;
    this.alignment = alignment;
  }
  draw(): void {
    context.font = this.font;
    context.textAlign = this.alignment;
    context.textBaseline = "hanging";
    context.fillText(this.text, this.x, this.y);
    let measurements = context.measureText(this.text);
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (this.box == true) {
      this.boxColor == undefined ? (context.fillStyle = "rgb(100,110,144)") : (context.fillStyle = this.boxColor);
      context.fillRect(this.x - 5, this.y - 5, measurements.width + 10, height + 10);
    }
    context.fillStyle = "black";
    context.fillText(this.text, this.x, this.y);
  }
}
