let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
import { gameEvent } from "./world";
import { upgrades, scrollOffset, elements } from "./menu";
let eventListener: any = document.getElementById("listener");
export class Text {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public clickable: boolean,
    public selectable: boolean,
    public box?: boolean,
    public boxColor?: string,
    public path?: string,
    public textColor?: string,
    public type?: string,
    private originalSize?: number
  ) {
    //     public x: number,
    //     public y: number,
    //     public text: string,
    //     public font: string,
    //     public box: boolean,
    //     public event?: string,
    //     public path?: string,
    //     public boxColor?: string,
    //     public type?: string,
    //     public originalSize?: number
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.box = box;
    clickable == undefined ? (this.clickable = false) : (this.clickable = clickable);
    selectable == undefined ? (this.selectable = false) : (this.selectable = selectable);
    context.font = this.font;
    this.originalSize = context.measureText(this.text).width;
    boxColor == undefined || boxColor == null ? (this.boxColor = "rgb(100,110,144)") : (this.boxColor = boxColor);
    this.type = "Text";
    this.textColor = textColor;
  }
  draw(): void {
    context.font = this.font;
    context.textAlign = "start";
    context.textBaseline = "hanging";
    context.fillText(this.text, this.x, this.y);
    let measurements = context.measureText(this.text);
    let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
    if (this.box == true) {
      context.fillStyle = this.boxColor;
      context.fillRect(this.x - 5, this.y - 5, measurements.width + 10, height + 10);
    }
    this.textColor == undefined ? (context.fillStyle = "black") : (context.fillStyle = this.textColor);
    context.fillText(this.text, this.x, this.y);
  }
  detectClick(mousePos): boolean {
    if (this.clickable == true) {
      context.font = this.font;
      let measurements = context.measureText(this.text);
      let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
      if (
        mousePos.x > this.x - 5 &&
        mousePos.y > this.y - 5 &&
        mousePos.x < this.x + measurements.width + 10 &&
        mousePos.y < this.y + height + 10
      ) {
        if (this.path == "play") {
          eventListener.dispatchEvent(gameEvent);
          game.style.display = "block";
          menu.style.display = "none";
          return;
        } else return true;
      }
    } else return;
  }
  hoveredOver(mousePos) {
    if (this.clickable == true) {
      context.font = this.font;
      let measurements = context.measureText(this.text);
      let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
      if (
        mousePos.x > this.x - 5 &&
        mousePos.y > this.y - 5 &&
        mousePos.x < this.x + measurements.width + 10 &&
        mousePos.y < this.y + height + 10
      ) {
        let value = this.font.split("px")[0].split(" ").map(Number);
        if (value.length > 1) {
          console.log(this.originalSize, +value[1] < this.originalSize);
          if (value[1] < this.originalSize * 1.1) {
            // value[1]++;
            console.log(value);
            this.font = value[1] * (measurements.width / this.originalSize) + "px Georgia";
          }
        } else if (value[0] < this.originalSize * 1.1) {
          value[0]++;
          this.font = value[0] * (measurements.width / this.originalSize) + "px Georgia";
        }
        // context.fillText("Specific action", this.x + measurements.width + 25, this.y + height); maybe expand upon later
        return true;
      }
    } else return;
  }
  restoreSize() {
    let split = this.font.split(" ");
    let value = this.font.split("px")[0].split(" ").map(Number);
    if (value.length > 1) {
      if (+value[1] > this.originalSize) {
        value[1]--;
        this.font = split[0] + " " + value[1] + "px " + split[2];
      } else {
        if (+value[0] > this.originalSize) {
          value[0]--;
          this.font = split[0] + " " + value[0] + "px " + split[2];
        }
      }
    }
  }
}

export class InteractiveBox {
  //mainly for hover-over images?
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public text: string,
    public descriptionText: string,
    public font: string,
    public fillStyle?: string,
    public box?: boolean,
    public stroke?: boolean,
    public selected?: boolean,
    private originWidth?: number,
    private originHeight?: number,
    private mouseX?: number,
    private mouseY?: number,
    public selectable?: boolean
  ) {
    this.x = x;
    this.y = y;
    this.originWidth = width;
    this.originHeight = height;
    this.width = width;
    this.height = height;
    if (box == undefined) this.box = true;
    this.descriptionText = descriptionText;
    font == undefined ? (this.font = "25px Georgia") : (this.font = font);
    this.fillStyle == undefined ? (this.fillStyle = "rgb(80,80,90)") : (this.fillStyle = fillStyle);
    this.selected = false;
    this.selectable = true;
  }
  draw() {
    if (this.box == true) {
      context.fillStyle = this.fillStyle;
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    context.fillStyle = "black";
    let value = this.font.split("px")[0].split(" ");
    if (value.length > 1) {
      context.font = +this.font.split("px")[0].split(" ")[1] * (this.width / this.originWidth) + "px Georgia";
    } else context.font = +this.font.split("px")[0].split(" ") * (this.width / this.originWidth) + "px Georgia";
    context.fillText(this.text, this.x, this.y + this.originHeight / 3);
    if (this.selected == true) {
      context.fillStyle = this.fillStyle;
      let lines = this.descriptionText.split("\n");
      context.font = "20px Georgia";
      if (this.mouseX == undefined || this.mouseY == undefined) {
        context.fillStyle = "black";
        for (let i = 0; i < lines.length; i++) context.fillText(lines[i], this.x + 5, this.y + 5 + i * 30);
      } else {
        context.fillRect(this.x + 50 + Math.abs(this.x - this.mouseX - 5), this.y + Math.abs(this.y - this.mouseY), 300, 150);
        context.strokeRect(this.x + 50 + Math.abs(this.x - this.mouseX - 5), this.y + Math.abs(this.y - this.mouseY), 300, 150);
        context.fillStyle = "black";
        for (let i = 0; i < lines.length; i++)
          context.fillText(lines[i], this.x + 55 + Math.abs(this.x - this.mouseX - 5), this.y + Math.abs(this.y - this.mouseY) + i * 30 + 5);
      }
    }
  }
  hoveredOver(mousePos) {
    this.mouseX = mousePos.x;
    this.mouseY = mousePos.y;
    if (
      mousePos.x > this.x - 5 + scrollOffset[0] &&
      mousePos.y > this.y - 5 + scrollOffset[1] &&
      mousePos.x < this.x + scrollOffset[0] + this.width + 10 &&
      mousePos.y < this.y + scrollOffset[1] + this.height + 10
    ) {
      this.selected = true;
      return true;
    }
  }
}
// export class TextButton {
//   constructor(
//     public x: number,
//     public y: number,
//     public text: string,
//     public font: string,
//     public box: boolean,
//     public event?: string,
//     public path?: string,
//     public boxColor?: string,
//     public type?: string,
//     public originalSize?: number
//   ) {
//     this.path = path;
//     this.type = "Button";
//     let tempsplit = this.font.split(" ")[1].split("px");
//     this.originalSize = +tempsplit[0];
//     path == undefined ? (this.path = "none") : (this.path = path);
//   }
//   draw(): void {
//     context.font = this.font;
//     context.textAlign = "start";
//     context.textBaseline = "hanging";
//     context.fillText(this.text, this.x, this.y);
//     let measurements = context.measureText(this.text);
//     let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
//     if (this.box == true) {
//       this.boxColor == undefined ? (context.fillStyle = "rgb(100,110,144)") : (context.fillStyle = this.boxColor);
//       context.fillRect(this.x - 5, this.y - 5, measurements.width + 10, height + 10);
//     }
//     context.fillStyle = "black";
//     context.fillText(this.text, this.x, this.y);
//   }
//   detectClick(mousePos): boolean {
//     context.font = this.font;
//     let measurements = context.measureText(this.text);
//     let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
//     if (
//       mousePos.x > this.x - 5 &&
//       mousePos.y > this.y - 5 &&
//       mousePos.x < this.x + measurements.width + 10 &&
//       mousePos.y < this.y + height + 10
//     ) {
//       if (this.event == "menu") {
//         return true;
//       } else if (this.event == "play") {
//         eventListener.dispatchEvent(gameEvent);
//         game.style.display = "block";
//         menu.style.display = "none";
//         return;
//       }
//       return true;
//     }
//   }
//   hoveredOver(mousePos) {
//     context.font = this.font;
//     let measurements = context.measureText(this.text);
//     let height = Math.abs(measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent);
//     if (
//       mousePos.x > this.x - 5 &&
//       mousePos.y > this.y - 5 &&
//       mousePos.x < this.x + measurements.width + 10 &&
//       mousePos.y < this.y + height + 10
//     ) {
//       let split = this.font.split(" ");
//       let value = +split[1].split("px")[0];
//       if (value < this.originalSize * 1.1) {
//         value += 1;
//         this.font = split[0] + " " + value + "px " + split[2];
//       }
//       // context.fillText("Specific action", this.x + measurements.width + 25, this.y + height); maybe expand upon later
//       return true;
//     }
//   }
//   restoreSize() {
//     let split = this.font.split(" ");
//     let value = +split[1].split("px")[0];
//     if (value > this.originalSize) {
//       value -= 1;
//       this.font = split[0] + " " + value + "px " + split[2];
//     }
//   }
// }
export class UpgradeBox {
  constructor(
    public x: number,
    public y: number,
    public upgrade: string,
    public path?: string,
    public type?: string,
    private width?: number,
    private height?: number,
    public selected?: boolean,
    public selectable?: boolean
  ) {
    this.x = x;
    this.y = y;
    this.upgrade = upgrade;
    this.type = type;
    this.path = path;
    this.type = "Upgrade";
    this.width = 140;
    this.height = 140;
    this.selectable = true;
  }
  draw(): void {
    context.translate(scrollOffset[0], scrollOffset[1]);
    context.fillStyle = "rgb(115,85,50)";
    for (let i = 0; i < upgrades.length; i++) {
      if (upgrades[i][0] == this.upgrade) {
        context.fillStyle = "rgb(140,110,80)";
      }
    }
    context.textBaseline = "middle";
    context.fillRect(this.x - 5, this.y - 5, this.width, this.height);
    context.fillStyle = "black";
    context.strokeRect(this.x - 5, this.y - 5, this.width, this.height);
    if (this.selected == true) {
      context.font = 28 * (this.width / 300) + "px Georgia";
      context.fillText(this.upgrade + ":", this.x + 5, this.y + 25);
      if (detectUpgrade(this.upgrade) !== false) {
        switch (this.upgrade) {
          case "Spears":
            context.font = 14.5 * (this.width / 300) + "px Georgia";
            context.fillText("Basic spear-wielding unit. Great for getting", this.x + 5, this.y + 70);
            context.fillText("across the map quickly. Also great in groups.", this.x + 5, this.y + 90);
            context.font = 13.5 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve damage done by Spearman.", this.x + 5, this.y + 120);
            break;
          case "Swords":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Basic melee unit. Strong against all", this.x + 5, this.y + 70);
            context.fillText("melee units, weak against ranged units.", this.x + 5, this.y + 90);
            context.font = 13 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve damage done by Swordsman.", this.x + 5, this.y + 120);
            break;
          case "Archery":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Basic bow-wielding unit. Shoots arrows.", this.x + 5, this.y + 70);
            context.font = 13.5 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120);
            break;
          case "Polearms":
            context.font = 14 * (this.width / 300) + "px Georgia";
            context.fillText("The ability to use halberds: a heavy weapon", this.x + 5, this.y + 70);
            context.fillText("with long range. ", this.x + 5, this.y + 90);
            context.font = 10.5 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve damage done by Halberdier.", this.x + 5, this.y + 120);
            break;
          case "Axes":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Axemen are fearless and will charge ", this.x + 5, this.y + 70);
            context.fillText("at the enemy! ", this.x + 5, this.y + 90);
            context.font = 14 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve damage done by Axeman.", this.x + 5, this.y + 120);
            break;
          case "Crossbows":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Hits heavier than a bow at the cost", this.x + 5, this.y + 70);
            context.fillText("of its accuracy! ", this.x + 5, this.y + 90);
            context.font = 12 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120);
            break;
          case "Longbows":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Shoots farther than a bow, with more ", this.x + 5, this.y + 70);
            context.fillText("accuracy!", this.x + 5, this.y + 90);
            context.font = 12 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120);
            break;
          case "Horsemanship":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Basic cavalry, fast unit, strong attack,", this.x + 5, this.y + 70);
            context.fillText("but less hitpoints.", this.x + 5, this.y + 90);
            context.font = 13.5 * (this.width / 300) + "px Georgia";
            context.fillText("Upgrade to increase damage done by Horseman.", this.x + 5, this.y + 120);
            break;
        }
        context.font = 15.5 * (this.width / 300) + "px Georgia";
        context.fillText("Current upgrades: " + detectUpgrade(this.upgrade)[1], this.x + 5, this.y + 150);
      } else {
        switch (this.upgrade) {
          case "Archery":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Basic bow-wielding unit. Shoots arrows.", this.x + 5, this.y + 70);
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Archery." + "add xp later", this.x + 5, this.y + 120);
            break;
          case "Polearms":
            context.font = 14 * (this.width / 300) + "px Georgia";
            context.fillText("The ability to use halberds: a heavy weapon", this.x + 5, this.y + 70);
            context.fillText("with long range. Unlocks Halberdier.", this.x + 5, this.y + 90);
            context.font = 15 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Polearms." + "add xp later", this.x + 5, this.y + 120);
            break;
          case "Axes":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Axemen are fearless and will charge ", this.x + 5, this.y + 70);
            context.fillText("at the enemy! Unlocks Axeman.", this.x + 5, this.y + 90);
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Axes." + "add xp later", this.x + 5, this.y + 120);
            break;
          case "Crossbows":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Hits heavier than a bow at the cost", this.x + 5, this.y + 70);
            context.fillText("of its accuracy! Unlocks Crossbowman.", this.x + 5, this.y + 90);
            context.font = 14.5 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Crossbows." + "add xp later", this.x + 5, this.y + 120);
            break;
          case "Longbows":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Shoots farther than a bow, with more ", this.x + 5, this.y + 70);
            context.fillText("accuracy! Unlocks Longbowman.", this.x + 5, this.y + 90);
            context.font = 15 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Longbows." + "add xp later", this.x + 5, this.y + 120);
            break;
          case "Horsemanship":
            context.font = 16 * (this.width / 300) + "px Georgia";
            context.fillText("Basic cavalry, fast unit, strong attack,", this.x + 5, this.y + 70);
            context.fillText("but less hitpoints. Unlocks Horseman.", this.x + 5, this.y + 90);
            context.font = 13.5 * (this.width / 300) + "px Georgia";
            context.fillText("Click here to unlock Horsemanship." + "add xp later", this.x + 5, this.y + 120);
            break;
        }
      }
    } else {
      context.font = 28 * (this.width / 125) + "px Georgia";
      context.fillText(this.upgrade, this.x + 2, this.y + 70, 125);
    }
    context.translate(-scrollOffset[0], -scrollOffset[1]);
  }
  detectClick(mousePos: any): boolean {
    if (
      mousePos.x + scrollOffset[0] > this.x + scrollOffset[0] - 5 &&
      mousePos.y + scrollOffset[1] > this.y + scrollOffset[1] - 5 &&
      mousePos.x + scrollOffset[0] < this.x + scrollOffset[0] + this.width &&
      mousePos.y + scrollOffset[1] < this.y + scrollOffset[1] + this.height
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
      if (this.width < 300) {
        this.width += (300 / this.width) * 10;
      }
      if (this.height < 185) {
        this.height += (185 / this.height) * 6.18;
      }
      return true;
    }
  }
  restoreSize() {
    if (this.width > 140) {
      this.width -= (this.width / 140) * 10;
    }
    if (this.height > 140) {
      this.height -= (this.height / 140) * 6.18;
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
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public selectable: boolean,
    public originalText: string,
    public descriptionText: string,
    public font?: string,
    public fillStyle?: string,
    public type?: string,
    public selected?: boolean,
    private originWidth?: number,
    private originHeight?: number
  ) {
    this.x = x;
    this.y = y;
    this.originWidth = width;
    this.originHeight = height;
    this.width = width;
    this.height = height;
    this.descriptionText = descriptionText;
    font == undefined ? (this.font = "25px Georgia") : (this.font = font);
    this.fillStyle == undefined ? (this.fillStyle = "rgb(80,80,90)") : (this.fillStyle = fillStyle);
    this.type = "Box";
    this.selected = false;
  }
  draw() {
    context.fillStyle = this.fillStyle;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeRect(this.x, this.y, this.width, this.height);
    if (this.selected == true) {
      let lines = this.descriptionText.split("\n");
      context.fillStyle = "black";
      context.font = 25 * (this.width / 300) + "px Georgia";
      for (let i = 0; i < lines.length; i++) context.fillText(lines[i], this.x + 5, this.y + 5 + i * 30);
    } else {
      context.fillStyle = "black";
      let value = this.font.split("px")[0].split(" ");
      if (value.length > 1) {
        context.font = +this.font.split("px")[0].split(" ")[1] * (this.width / this.originWidth) + "px Georgia";
      } else context.font = +this.font.split("px")[0].split(" ") * (this.width / this.originWidth) + "px Georgia";
      context.fillText(this.originalText, this.x, this.y + this.originHeight / 3);
    }
  }
  hoveredOver(mousePos) {
    if (
      mousePos.x > this.x - 5 + scrollOffset[0] &&
      mousePos.y > this.y - 5 + scrollOffset[1] &&
      mousePos.x < this.x + scrollOffset[0] + this.width + 10 &&
      mousePos.y < this.y + scrollOffset[1] + this.height + 10
    ) {
      if (this.width < 300) {
        this.width += (300 / this.width) * 10;
      }
      if (this.height < 185) {
        this.height += (185 / this.height) * 6.18;
      }
      this.selected = true;
      return true;
    }
  }
  restoreSize() {
    this.selected = false;
    if (this.width > this.originWidth) {
      this.width -= (this.width / this.originWidth) * 10;
    }
    if (this.height > this.originHeight) {
      this.height -= (this.height / this.originHeight) * 6.18;
    }
  }
}

export class DropZone {
  constructor(public x: number, public y: number, public width: number, public height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
export class Minimap {
  constructor(public x: number, public y: number, public zoom?: number, public type?: string, public Scrolling?: boolean) {
    this.x = x;
    this.y = y;
    this.type = "Minimap";
    this.zoom = 15;
  }
  draw() {
    this.Scrolling = true;
    context.fillStyle = "rgb(120,100,60)";
    context.fillRect(this.x, this.y, 200, 200);
    context.strokeRect(this.x, this.y, 200, 200);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Upgrade") {
        if (detectUpgrade(elements[i].upgrade) !== false) {
          context.fillStyle = "rgb(64,80,64)";
        } else {
          context.fillStyle = "rgb(50,50,50)";
        }
        context.fillRect(this.x + elements[i].x / this.zoom + this.zoom, this.y + elements[i].y / this.zoom, 140 / this.zoom, 140 / this.zoom);
      }
    }
    context.strokeRect(
      this.x + this.zoom - scrollOffset[0] / this.zoom,
      this.y - scrollOffset[1] / this.zoom,
      1200 / this.zoom,
      800 / this.zoom
    );
    if (scrollOffset[1] >= this.zoom) {
      scrollOffset[1] = this.zoom;
      this.Scrolling = false;
    }
    if (scrollOffset[0] >= this.zoom * this.zoom) {
      scrollOffset[0] = this.zoom * this.zoom;
      this.Scrolling = false;
    }
    if (scrollOffset[0] - 1200 <= -200 * this.zoom + this.zoom * this.zoom) {
      scrollOffset[0] = -200 * this.zoom + this.zoom * this.zoom + 1200;
      this.Scrolling = false;
    }
    if (scrollOffset[1] - 800 <= -200 * this.zoom + this.zoom) {
      scrollOffset[1] = -200 * this.zoom + this.zoom + 800;
      this.Scrolling = false;
    }
  }
}
function detectUpgrade(upgrade) {
  for (let k = 0; k < upgrades.length; k++) {
    if (upgrades[k][0] == upgrade) {
      return upgrades[k];
    }
  }
  return false;
}
