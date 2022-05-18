let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
import { customEvent } from "./world";
import { upgrades, scrollOffset } from "./menu";
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
    public type?: string,
    public originalSize?: number
  ) {
    super(x, y, text, font, box, boxColor, type);
    this.path = path;
    this.type = "Button";
    let tempsplit = this.font.split(" ")[1].split("px");
    this.originalSize = +tempsplit[0];
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
      let split = this.font.split(" ");
      let value = +split[1].split("px")[0];
      if (value < this.originalSize * 1.1) {
        value += 1;
        this.font = split[0] + " " + value + "px " + split[2];
      }
      return true;
    }
  }
  restoreSize() {
    let split = this.font.split(" ");
    let value = +split[1].split("px")[0];
    if (value > this.originalSize) {
      value -= 1;
      this.font = split[0] + " " + value + "px " + split[2];
    }
  }
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
  constructor(public x, public y, public upgrade, public font?, public path?, public type?, private width?, private height?, public selected?) {
    super(x, y, upgrade, font, type);
    this.path = path;
    this.type = "UpgradeTree";
    this.width = 140;
    this.height = 140;
  }
  draw(): void {
    context.translate(scrollOffset[0], scrollOffset[1]);
    context.fillStyle = "rgb(100,70,40)";
    for (let i = 4; i < upgrades.length; i++) {
      if (upgrades[i][0] == this.upgrade) {
        context.fillStyle = "rgb(140,110,80)";
      }
    }
    context.font = this.font;
    context.textBaseline = "middle";
    context.fillRect(this.x - 5, this.y - 5, this.width, this.height);
    context.fillStyle = "black";
    context.strokeRect(this.x - 5, this.y - 5, this.width, this.height);
    if (this.selected == true) {
      context.font = 40 * (this.width / 400) + "px Georgia";
      context.fillText(this.upgrade + ":", this.x + 10, this.y + 25);
      switch (this.upgrade) {
        case "Archery":
          context.font = 20 * (this.width / 400) + "px Georgia";
          context.fillText("The ability to shoot arrows. Grants Archer.", this.x + 10, this.y + 70);
          context.font = 18 * (this.width / 400) + "px Georgia";
          context.fillText("Upgrade Archery to improve Archer accuracy.", this.x + 10, this.y + 110);
          break;
        case "Polearms":
          context.font = 18 * (this.width / 400) + "px Georgia";
          context.fillText("The ability to use halberds. Unlocks Halberdier.", this.x + 10, this.y + 70);
          context.font = 14 * (this.width / 400) + "px Georgia";
          context.fillText("Upgrade Polearms to improve damage done with Halberdier.", this.x + 10, this.y + 110);
          break;
      }
    } else {
      context.fillText(this.upgrade, this.x, this.y + 70);
    }
    context.translate(-scrollOffset[0], -scrollOffset[1]);
  }
  detectClick(mousePos: any): boolean {
    context.font = this.font;
    if (
      mousePos.x + scrollOffset[0] > this.x + scrollOffset[0] - 5 &&
      mousePos.y + scrollOffset[1] > this.y + scrollOffset[1] - 5 &&
      mousePos.x + scrollOffset[0] < this.x + scrollOffset[0] + 140 &&
      mousePos.y + scrollOffset[1] < this.y + scrollOffset[1] + 140
    ) {
      return true;
    } else {
    }
  }
  hoveredOver(mousePos) {
    if (
      mousePos.x > this.x - 5 + scrollOffset[0] &&
      mousePos.y > this.y - 5 + scrollOffset[1] &&
      mousePos.x < this.x + scrollOffset[0] + this.width + 10 &&
      mousePos.y < this.y + scrollOffset[1] + this.height + 10
    ) {
      if (this.width < 400) {
        this.width += (400 / this.width) * 6;
      }
      if (this.height < 247) {
        this.height += (247 / this.height) * 3.7;
      }
      return true;
    }
  }
  restoreSize() {
    if (this.width > 140) {
      this.width -= (this.width / 140) * 6;
    }
    if (this.height > 140) {
      this.height -= (this.height / 140) * 3.7;
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
export class Box {
  constructor(public x, public y, public width, public height, public fillStyle?) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillStyle == undefined ? (this.fillStyle = "black") : (this.fillStyle = fillStyle);
  }
  draw() {
    context.fillStyle = this.fillStyle;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
