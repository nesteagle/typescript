let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let windowID: number;
menu.style.display = "block";
game.style.display = "none";

let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
class TextBox {
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
    context.fillText(this.text, this.x, this.y);
    let measurements = context.measureText(this.text);
    let height =
      measurements.fontBoundingBoxDescent - measurements.fontBoundingBoxAscent;
    if (this.box == true) {
      this.boxColor == undefined
        ? (context.fillStyle = "rgb(100,110,144)")
        : (context.fillStyle = this.boxColor);
      context.fillRect(
        this.x - measurements.width / 30,
        this.y - height / 2,
        measurements.width + measurements.width / 15,
        height * 2
      );
    }
    context.fillStyle = "black";
    context.fillText(this.text, this.x, this.y);
  }
}

class TextButton extends TextBox {
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
    super(x, y, text, font, box, boxColor, rendering);
    this.path = path;
    this.type = "Button";
    path == undefined ? (this.path = "none") : (this.path = path);
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
      if (this.event == "menu") {
        console.log(this.path);
        return true;
      } else if (this.event == "play") {
        game.style.display = "block";
        menu.style.display = "none";
        console.log("displays changed");
        return;
      }
      console.log("in bounds");
      return true;
    } else {
    }
  }
}
class UpgradeBox {
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

class Background {
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

let background = new Background(0, 0, false);
let elements: Array<any> = [
  new TextBox(100, 200, "Game Title", "600 90px Georgia", true),
  new TextButton(
    100,
    500,
    "Play Campaign",
    "200 45px Georgia",
    true,
    "menu",
    "campaign1"
  ),
  new TextButton(
    100,
    600,
    "Upgrades",
    "200 45px Georgia",
    true,
    "menu",
    "upgrade1"
  ),
];
function getMousePos(canvas, event) {
  let bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
function update() {
  windowID = window.requestAnimationFrame(update);
  context.fillStyle = "black";
  background.draw();
  for (let i = 0; i < elements.length; i++) {
    elements[i].draw();
  }
}
update();

menu.addEventListener(
  "click",
  function (event) {
    console.log("clicked");
    let mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Upgrade") {
        if (elements[i].detectClick(mousePos) == true) {
          console.log("true");
        }
      }
      if (elements[i].type == "Button") {
        if (elements[i].detectClick(mousePos) == true) {
          switch (elements[i].path) {
            case "menu":
              background.rendering = false;
              elements = [
                new TextBox(100, 200, "Game Title", "600 90px Georgia", true),
                new TextButton(
                  100,
                  500,
                  "Play Campaign",
                  "200 45px Georgia",
                  true,
                  "menu",
                  "campaign1"
                ),
              ];
              break;
            case "campaign1":
              background.rendering = true;
              elements = [
                new TextButton(
                  100,
                  500,
                  "Start Campaign",
                  "200 45px Georgia",
                  true,
                  "play"
                ),
                new TextButton(
                  50,
                  850,
                  "Back",
                  "200 25px Georgia",
                  true,
                  "menu",
                  "menu"
                ),
              ];
              break;
            case "upgrade1":
              background.rendering = true;
              elements = [
                new UpgradeBox(
                  150,
                  300,
                  "Swords",
                  "200 25px Georgia",
                  "Upgrade"
                ),
                new UpgradeBox(
                  150,
                  350,
                  "Spears",
                  "200 25px Georgia",
                  "Upgrade"
                ),
                new UpgradeBox(
                  150,
                  400,
                  "Archery",
                  "200 25px Georgia",
                  "Upgrade"
                ),

                new TextButton(
                  50,
                  850,
                  "Back",
                  "200 25px Georgia",
                  true,
                  "menu",
                  "menu"
                ),
              ];
          }
        }
      }
    }
  },
  false
);
