import { gameEvent } from "./world";
import { upgrades, scrollOffset, elements } from "./menu";
let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundEquip = document.getElementById("source4") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
let mousePos: any, finalmousePos: any, currentlyDragged: any;
let mouseisDown = false;
document.addEventListener("mousedown", (event) => {
  mouseisDown = true;
  mousePos = getMousePos(event);
});
document.addEventListener("mousemove", (event) => {
  mousePos = getMousePos(event);
});
document.addEventListener("mouseup", (event) => {
  mousePos = getMousePos(event);
  finalmousePos = mousePos;
  mouseisDown = false;
});
function getMousePos(event) {
  let bounds = menu.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
let eventListener: any = document.getElementById("listener");
export class Text {
  constructor(
    public x: number,
    public y: number,
    public text: string,
    public font: string,
    public clickable: boolean,
    public box?: boolean,
    public boxColor?: string,
    public path?: string,
    public textColor?: string,
    public type?: string,
    private originalSize?: any
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.box = box;
    clickable == undefined ? (this.clickable = false) : (this.clickable = clickable);
    this.originalSize = +this.font.split(" ")[1].split("px")[0];
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
  detectClick(mousePos: any): boolean {
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
  hoveredOver(mousePos: any) {
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
          if (value[1] < this.originalSize * 1.1) {
            value[1]++;
            this.font = value[1] + "px Georgia";
          }
        } else if (value[0] < this.originalSize * 1.1) {
          value[0]++;
          this.font = value[0] + "px Georgia";
        }
        // context.fillText("Specific action", this.x + measurements.width + 25, this.y + height); maybe expand upon later
        return true;
      }
    } else return;
  }
  restoreSize() {
    let value = this.font.split("px")[0].split(" ").map(Number);
    context.font = this.font;
    if (value.length > 1) {
      if (value[1] > this.originalSize) {
        value[1]--;
        this.font = value[1] + "px Georgia";
      }
    } else {
      if (value[0] > this.originalSize) {
        value[0]--;
        this.font = value[0] + "px Georgia"; //removed font implementation for now
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
  hoveredOver(mousePos: any) {
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
            renderText(
              "Basic spear-wielding unit. Great for getting\nacross the map quickly. Also great in groups.",
              this.x + 5,
              this.y + 70,
              20,
              14.5 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve damage done by Spearman.", this.x + 5, this.y + 120, 0, 13.5 * (this.width / 300) + "px Georgia");
            break;
          case "Swords":
            renderText(
              "Basic melee unit. Strong against all\nmelee units, weak against ranged units.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve damage done by Swordsman.", this.x + 5, this.y + 120, 0, 13 * (this.width / 300) + "px Georgia");
            break;
          case "Archery":
            renderText("Basic bow-wielding unit. Shoots arrows.", this.x + 5, this.y + 70, 0, 16 * (this.width / 300) + "px Georgia");
            renderText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120, 0, 13.5 * (this.width / 300) + "px Georgia");
            break;
          case "Polearms":
            renderText(
              "The ability to use halberds: a heavy weapon\nwith long range.",
              this.x + 5,
              this.y + 70,
              20,
              14 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve damage done by Halberdier.", this.x + 5, this.y + 120, 0, 10.5 * (this.width / 300) + "px Georgia");
            break;
          case "Axes":
            renderText(
              "Axemen are fearless and will charge\nat the enemy!",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve damage done by Axeman.", this.x + 5, this.y + 120, 0, 14 * (this.width / 300) + "px Georgia");
            break;
          case "Crossbows":
            renderText(
              "Hits heavier than a bow at the cost\nof its accuracy!",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120, 0, 12 * (this.width / 300) + "px Georgia");
            break;
          case "Longbows":
            renderText("Shoots farther than a bow, with more\naccuracy!", this.x + 5, this.y + 70, 20, 16 * (this.width / 300) + "px Georgia");
            renderText("Upgrade to improve projectile accuracy.", this.x + 5, this.y + 120, 0, 12 * (this.width / 300) + "px Georgia");
            break;
          case "Horsemanship":
            renderText(
              "Basic cavalry. Fast unit, strong attack,\ndecent armor.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Upgrade to improve damage done by Horseman.", this.x + 5, this.y + 120, 0, 13.5 * (this.width / 300) + "px Georgia");
            break;
        }
        renderText(
          "Current upgrades: " + detectUpgrade(this.upgrade)[1],
          this.x + 5,
          this.y + 150,
          0,
          15.5 * (this.width / 300) + "px Georgia"
        );
      } else {
        switch (this.upgrade) {
          case "Archery":
            renderText(
              `Basic bow-wielding unit.Shoots arrows.\nClick here to unlock Archery.${0}`, //will be xp required
              this.x + 5,
              this.y + 70,
              50,
              16 * (this.width / 300) + "px Georgia"
            );
            break;
          case "Polearms":
            renderText(
              "The ability to use halberds: a heavy weapon\nwith long range. Unlocks Halberdier.",
              this.x + 5,
              this.y + 70,
              20,
              14 * (this.width / 300) + "px Georgia"
            );
            renderText("Click here to unlock Polearms." + "add xp later", this.x + 5, this.y + 120, 0, 15 * (this.width / 300) + "px Georgia");
            break;
          case "Axes":
            renderText(
              "Axemen are fearless and will charge\nat the enemy! Unlocks Axeman.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Click here to unlock Axes." + "add xp later", this.x + 5, this.y + 120, 0, 16 * (this.width / 300) + "px Georgia");
            break;
          case "Crossbows":
            renderText(
              "Hits heavier than a bow at the cost\nof its accuracy! Unlocks Crossbowman.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText(
              "Click here to unlock Crossbows." + "add xp later",
              this.x + 5,
              this.y + 120,
              0,
              14.5 * (this.width / 300) + "px Georgia"
            );
            break;
          case "Longbows":
            renderText(
              "Shoots farther than a bow, with more\naccuracy! Unlocks Longbowman.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText("Click here to unlock Longbows." + "add xp later", this.x + 5, this.y + 120, 0, 15 * (this.width / 300) + "px Georgia");
            break;
          case "Horsemanship":
            renderText(
              "Basic cavalry. Fast unit, strong attack,\ndecent armor. Unlocks Horseman.",
              this.x + 5,
              this.y + 70,
              20,
              16 * (this.width / 300) + "px Georgia"
            );
            renderText(
              "Click here to unlock Horsemanship." + "add xp later",
              this.x + 5,
              this.y + 120,
              0,
              13.5 * (this.width / 300) + "px Georgia"
            );
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
  hoveredOver(mousePos: any) {
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
  constructor(public x: number, public y: number, public rendering?: string) {
    this.x = x;
    this.y = y;
    this.rendering = rendering;
  }
  draw() {
    switch (this.rendering) {
      case "menu":
        context.drawImage(backgroundSource, 0, 0);
        break;
      case "main":
        context.drawImage(backgroundMain, 0, 0);
        break;
      case "equip":
        context.drawImage(backgroundEquip, 0, 0);
        break;
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
  hoveredOver(mousePos: any) {
    if (this.selectable == true) {
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
  }
  restoreSize() {
    if (this.selectable == true) {
      this.selected = false;
      if (this.width > this.originWidth) {
        this.width -= (this.width / this.originWidth) * 10;
      }
      if (this.height > this.originHeight) {
        this.height -= (this.height / this.originHeight) * 6.18;
      }
    }
  }
}

export class DraggableBox {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    private dragged?: boolean,
    private hoveredOver?: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dragged = false;
  }
  draw() {
    if (this.mouseOver(mousePos) == true || this.hoveredOver == true) {
      if (mouseisDown == true) {
        this.hoveredOver = true;
        this.dragged = true;
        currentlyDragged = this;
        context.fillStyle = "rgb(32,32,32)";
        context.fillRect(mousePos.x - this.width / 2, mousePos.y - this.height / 2, this.width, this.height);
        context.strokeRect(mousePos.x - this.width / 2, mousePos.y - this.height / 2, this.width, this.height);
        context.fillStyle = "rgba(32,32,32,0.8)";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
      } else {
        this.hoveredOver = false;
        context.fillStyle = "rgba(32,32,32,1)";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
      }
    } else {
      context.fillStyle = "rgba(32,32,32,1)";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
  mouseOver(mousePos: any) {
    if (mousePos.x > this.x - 5 && mousePos.y > this.y - 5 && mousePos.x < this.x + this.width + 10 && mousePos.y < this.y + this.height + 10) {
      return true;
    }
    return false;
  }
}
export class DropZone {
  constructor(public x: number, public y: number, public width: number, public height: number, public id: number, private dragging?: boolean) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
  }
  draw() {
    if (mouseisDown == true) {
      context.strokeStyle = "rgba(120,100,0 ,0.8)";
      context.lineWidth = 10;
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.strokeStyle = "black";
    }
    if (mouseisDown == false) {
      if (currentlyDragged !== undefined) {
        if (
          (finalmousePos.x > this.x - 5 &&
            finalmousePos.y > this.y - 5 &&
            finalmousePos.x < this.x + this.width + 10 &&
            finalmousePos.y < this.y + this.height + 10 &&
            currentlyDragged.dragged == true) ||
          this.dragging == true
        ) {
          this.dragging = true;
          let vx: number = (this.x - currentlyDragged.x - 2.5) / 6;
          let vy: number = (this.y - currentlyDragged.y - 2.5) / 6;
          if (Math.abs(currentlyDragged.x - this.x) - 2.5 < 0.1 && Math.abs(currentlyDragged.y - this.y) - 2.5 < 0.1) {
            currentlyDragged.x = this.x - 2.5;
            currentlyDragged.y = this.y - 2.5;
            currentlyDragged.dragged = false;
            this.dragging = false;
          } else console.log(Math.abs(currentlyDragged.x - this.x - 5), Math.abs(currentlyDragged.y - this.y));
          currentlyDragged.x += vx;
          currentlyDragged.y += vy;
        }
      }
    }
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
function detectUpgrade(upgrade: any) {
  for (let k = 0; k < upgrades.length; k++) {
    if (upgrades[k][0] == upgrade) {
      return upgrades[k];
    }
  }
  return false;
}
function renderText(text: string, x: number, y: number, spacing: number, font: string) {
  let lines = text.split("\n");
  context.font = font;
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, y + i * spacing);
  }
}
