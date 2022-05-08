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
        ? (context.fillStyle = "rgb(100,100,144)")
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

// class BackButton {
//   constructor(
//     public font,
//     public clickable,
//     public event,
//     public path,
//     public x?,
//     public y?,
//     public text?,
//     public rendering?
//   ) {
//     this.x = 50;
//     this.y = 850;
//     this.text = "Back";
//   }
//   draw(): void {
//     context.font = this.font;
//     context.fillText(this.text, this.x, this.y);
//   }
//   detectClick(mousePos): boolean {
//     let measurements = context.measureText(this.text);
//     if (
//       mousePos.x > this.x &&
//       mousePos.x < this.x + measurements.width &&
//       mousePos.y < this.y + measurements.fontBoundingBoxDescent &&
//       mousePos.y > this.y - measurements.fontBoundingBoxAscent
//     ) {
//       return true;
//     }
//   }
// }

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
  new TextBox(100, 300, "Game Title", "600 90px Georgia", true),
  new TextButton(100, 500, "Long Ubiquitous text", "200 45px Georgia", true),
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
elements[1].draw();
function drawAll(): void {}

menu.addEventListener(
  "click",
  function (event) {
    console.log("clicked");
    let mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Button") {
        console.log(elements[i].detectClick(mousePos));
        if (elements[i].detectClick(mousePos) == true) {
          console.log("true");
        }
      }
    }
  },
  false
);
// menu.addEventListener(
//   "click",
//   function (event) {
//     let mousePos = getMousePos(menu, event);
//     console.log(elements);
//     for (let i = 0; i < elements.length; i++) {
//       if (
//         elements[i].clickable == true &&
//         elements[i].detectClick(mousePos) == true
//       ) {
//         if (elements[i] == UpgradeBox) {
//           console.log("upgrade box clicked");
//         }
//         if (elements[i].path !== "none") {
//           switch (elements[i].path) {
//             case "menu":
//               background.rendering = false;
//               elements = [
//                 new TextBox(100, 100, "GameTitle", "600 90px Georgia", false),
//                 new TextBox(
//                   250,
//                   400,
//                   "Campaign",
//                   "30px Georgia",
//                   true,
//                   "menu",
//                   "campaign1"
//                 ),
//                 new TextBox(
//                   250,
//                   500,
//                   "Upgrades",
//                   "30px Georgia",
//                   true,
//                   "menu",
//                   "upgrades1"
//                 ),
//               ];
//               break;
//             case "campaign1":
//               background.rendering = true;
//               elements = [
//                 new TextBox(
//                   500,
//                   400,
//                   "Play Campaign",
//                   "30px Georgia",
//                   true,
//                   "play"
//                 ),
//                 new BackButton("45px Georgia", true, "menu", "menu"),
//               ];
//               break;
//             case "upgrades1":
//               background.rendering = true;
//               elements = [
//                 new TextBox(50, 80, "Upgrade Menu", "45px Georgia", false),
//                 new BackButton("45px Georgia", true, "menu", "menu"),
//                 new UpgradeBox(400, 400, "Swords", "20px Georgia"),
//                 new UpgradeBox(400, 450, "Spears", "20px Georgia"),
//                 new UpgradeBox(400, 500, "Bows", "20px Georgia"),
//                 new UpgradeBox(400, 550, "Armor", "20px Georgia"),
//               ];
//               break;
//             default:
//           }
//         }
//       }
//     }
//   },
//   false
// );

// class UpgradeBox {
//   constructor(
//     public x,
//     public y,
//     public upgrade,
//     public font?,
//     public clickable?
//   ) {
//     this.x = x;
//     this.y = y;
//     this.upgrade = upgrade;
//     this.font = font;
//     this.clickable = true;
//   }
//   draw(): void {
//     context.font = this.font;
//     context.fillStyle = "rgb(100,70,40)";
//     context.strokeRect(this.x, this.y, 48, 32);
//     context.fillStyle = "black";
//     context.fillText(
//       `Upgrade ${this.upgrade}:put cost here`,
//       this.x + 60,
//       this.y + 22
//     );
//     context.fillText("Buy", this.x + 6, this.y + 22);
//   }
//   detectClick(mousePos): boolean {
//     if (
//       mousePos.x > this.x &&
//       mousePos.x < this.x + 48 &&
//       mousePos.y < this.y + 32 &&
//       mousePos.y > this.y
//     ) {
//       return true;
//     }
//   }
// }
