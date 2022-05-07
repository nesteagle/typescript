let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let elements: Array<any> = [];
let windowID: number;
menu.style.display = "block";
game.style.display = "none";

let backgroundSource = document.getElementById("source3") as CanvasImageSource;
let backgroundMain = document.getElementById("source") as CanvasImageSource; //  temporary
class TextBox {
  constructor(
    public x,
    public y,
    public text,
    public font,
    public clickable,
    public event?,
    public path?,
    public rendering?
  ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.event = event;
    path == undefined ? (this.path = "none") : (this.path = path);
  }
  draw(): void {
    context.font = this.font;
    context.fillText(this.text, this.x, this.y);
  }
  detectClick(mousePos): boolean {
    let measurements = context.measureText(this.text);
    if (
      mousePos.x > this.x &&
      mousePos.x < this.x + measurements.width &&
      mousePos.y < this.y + measurements.fontBoundingBoxDescent &&
      mousePos.y > this.y - measurements.fontBoundingBoxAscent
    ) {
      if (this.event == "menu") {
        background.rendering = true;
        return true;
      } else if (this.event == "play") {
        game.style.display = "block";
        menu.style.display = "none";
        console.log("displays changed");
        return;
      }
      console.log("in bounds");
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
elements.push(new TextBox(100, 100, "GameTitle", "600 90px Georgia", false));
elements.push(
  new TextBox(400, 400, "Campaign", "30px Georgia", true, "menu", "campaign1")
);

function getMousePos(canvas, event) {
  let bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

menu.addEventListener(
  "click",
  function (event) {
    let mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].clickable == true) {
        if (elements[i].path !== "none") {
          switch (elements[i].path) {
            case "campaign1":
              elements.push(
                new TextBox(
                  500,
                  400,
                  "Play Campaign",
                  "30px Georgia",
                  true,
                  "play"
                )
              );
              break;
            default:
          }
        }
        if (elements[i].detectClick(mousePos) == true) {
          console.log(elements.splice(i, 1));
        }
      }
    }
  },
  false
);
function update() {
  windowID = window.requestAnimationFrame(update);
  context.clearRect(0, 0, menu.width, menu.height);
  background.draw();
  for (let i = 0; i < elements.length; i++) {
    elements[i].draw();
  }
}
update();
