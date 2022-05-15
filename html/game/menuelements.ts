let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
import { customEvent } from "./world";
import { upgrades } from "./menu";
let eventListener: any = document.getElementById("listener");
export class TextBox {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public box: boolean,
    public boxColor?: string,
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
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (this.box == true) {
      this.boxColor == undefined ? (context.fillStyle = "rgb(100,110,144)") : (context.fillStyle = this.boxColor);
      context.fillRect(this.x - 5, this.y - 5, measurements.width + 10, height + 10);
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
    public boxColor?: string,
    public type?: string
  ) {
    super(x, y, text, font, box, boxColor, type);
    this.path = path;
    this.type = "Button";
    path == undefined ? (this.path = "none") : (this.path = path);
  }
  detectClick(mousePos): boolean {
    context.font = this.font;
    let measurements = context.measureText(this.text);
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (
      mousePos.x > this.x - 5 &&
      mousePos.y > this.y - 5 &&
      mousePos.x < this.x + measurements.width + 10 &&
      mousePos.y < this.y + height + 10
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
  hoveredOver(mousePos) {
    context.font = this.font;
    let measurements = context.measureText(this.text);
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (
      mousePos.x > this.x - 5 &&
      mousePos.y > this.y - 5 &&
      mousePos.x < this.x + measurements.width + 10 &&
      mousePos.y < this.y + height + 10
    ) {
      let split = this.font.split(" ")[1].split("px");
      let value = +split[0];
      //console.log(split[1].split("px"), split);
      console.log(value);
      value += 1;
      if (value < 60) {
        this.font = "200 " + value + "px Georgia";
      }
      console.log(this.font);
    }
  }
  restoreSize() {}
}

export class UpgradeBox {
  constructor(public x, public y, public upgrade, public font?, public type?, public text?) {
    this.x = x;
    this.y = y;
    this.upgrade = upgrade;
    this.font = font;
    this.type = "Upgrade";
  }
  draw(): void {
    context.font = this.font;
    context.fillStyle = "black";
    for (let i = 0; i < upgrades.length; i++) {
      if (upgrades[i][0] == this.upgrade) {
        context.fillText(`Upgrade ${this.upgrade}:${(upgrades[i][1] + 1) * 400}, ${upgrades[i][1]} upgrades`, this.x + 55, this.y);
      }
    }
    context.fillText("Buy", this.x, this.y);
    let measurements = context.measureText("Buy");
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    context.fillStyle = "rgb(100,100,100)";
    context.fillRect(this.x - 5, this.y - 5, measurements.width + 10, height + 10);
    context.fillStyle = "black";
    context.fillText("Buy", this.x, this.y);
  }
  detectClick(mousePos): boolean {
    context.font = this.font;
    let measurements = context.measureText(this.text);
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (
      mousePos.x > this.x - 5 &&
      mousePos.y > this.y - 5 &&
      mousePos.x < this.x + measurements.width + 10 &&
      mousePos.y < this.y + height + 10
    ) {
      return true;
    } else {
    }
  }
}
export class TreeBox extends UpgradeBox {
  constructor(public x, public y, public upgrade, public font?, public path?, public type?, public text?) {
    super(x, y, upgrade, font, type);
    this.path = path;
    this.type = "UpgradeTree";
  }
  draw(): void {
    context.fillStyle = "rgb(100,70,40)";
    for (let i = 4; i < upgrades.length; i++) {
      if (upgrades[i][0] == this.upgrade) {
        context.fillStyle = "rgb(140,110,80)";
      }
    }
    context.font = this.font;
    context.textBaseline = "middle";
    context.fillRect(this.x - 5, this.y - 5, 140, 140);
    context.fillStyle = "black";
    context.fillText(this.upgrade, this.x, this.y + 70);
  }
  detectClick(mousePos: any): boolean {
    context.font = this.font;
    if (mousePos.x > this.x - 5 && mousePos.y > this.y - 5 && mousePos.x < this.x + 140 && mousePos.y < this.y + 140) {
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
