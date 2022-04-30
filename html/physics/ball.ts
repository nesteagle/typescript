export class Ball {
  public x: number;
  public y: number;
  public radius: number;
  private context: CanvasRenderingContext2D;
  constructor(x, y, radius?) {
    this.x = x;
    this.y = y;
    radius == undefined ? (this.radius = 75) : (this.radius = radius);
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    this.context = context!;
  }
  draw = (): void => {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.context.fill();
  };
}
