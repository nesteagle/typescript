let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
import { customEvent } from "./world";
let eventListener: any = document.getElementById("listener");
export class TextBox {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public box: boolean,
    public boxColor?: string,
    public rendering?: boolean,
    public type?: string
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.box = box;
    this.boxColor = boxColor;
    this.type = "TextBox";
  }
  draw(): void {
    context.font = this.font;
    context.textAlign = "start";
    context.textBaseline = "hanging";
    context.fillText(this.text, this.x, this.y);
    let measurements = context.measureText(this.text);
    let height = Math.abs(
      measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent
    );
    if (this.box == true) {
      this.boxColor == undefined
        ? (context.fillStyle = "rgb(100,110,144)")
        : (context.fillStyle = this.boxColor);
      context.fillRect(
        this.x - 5,
        this.y - 5,
        measurements.width + 10,
        height + 10
      );
    }

    context.fillStyle = "black";
    context.fillText(this.text, this.x, this.y);
  }
}

export class TextButton extends TextBox {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public box: boolean,
    public event?: string,
    public path?: string,
    public rendering?: boolean,
    public boxColor?: string,
    public type?: string
  ) {
    super(x, y, text, font, box, boxColor, rendering, type);
    this.path = path;
    this.type = "Button";
    path == undefined ? (this.path = "none") : (this.path = path);
  }
  detectClick(mousePos): boolean {
    context.font = this.font;
    let measurements = context.measureText(this.text);
    let height = Math.abs(
      measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent
    );

    if (
      mousePos.x > this.x &&
      mousePos.y > this.y &&
      mousePos.x < this.x + measurements.width &&
      mousePos.y < this.y + height
    ) {
      if (this.event == "menu") {
        console.log(this.path);
        return true;
      } else if (this.event == "play") {
        eventListener.dispatchEvent(customEvent);
        game.style.display = "block";
        menu.style.display = "none";
        return;
      }
      console.log("in bounds");
      return true;
    } else {
    }
  }
}
export class UpgradeBox {
  constructor(
    public x,
    public y,
    public upgrade,
    public font?,
    public type?,
    private text?
  ) {
    this.x = x;
    this.y = y;
    this.upgrade = upgrade;
    this.font = font;
    this.type = "Upgrade";
  }
  draw(): void {
    context.font = this.font;
    context.fillStyle = "rgb(100,70,40)";
    context.fillStyle = "black";
    context.fillText(
      `Upgrade ${this.upgrade}:put cost here`,
      this.x + 55,
      this.y
    );
    context.fillText("Buy", this.x, this.y);
    let measurements = context.measureText("Buy");
    let height =
      measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent;
    context.fillStyle = "rgb(100,100,100)";
    context.fillRect(
      this.x - measurements.width / 30,
      this.y - height / 2,
      measurements.width + measurements.width / 15,
      height * 2
    );
    context.fillStyle = "black";
    context.fillText("Buy", this.x, this.y);
  }
  detectClick(mousePos): boolean {
    let measurements = context.measureText(this.text);
    let height =
      measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent;
    if (
      mousePos.x > this.x - measurements.width / 30 &&
      mousePos.x < this.x + measurements.width + measurements.width / 15 &&
      mousePos.y < this.y - height / 2 &&
      mousePos.y > this.y + height * 2
    ) {
      return true;
    } else {
    }
  }
}

export class Background {
  constructor(public x, public y, public rendering?) {
    this.x = x;
    this.y = y;
    this.rendering = rendering;
  }
  draw() {
    if (this.rendering == true) {
      context.drawImage(backgroundSource, 0, 0);
    } else {
      context.drawImage(backgroundMain, 0, 0);
    }
  }
}
