import { TextBox, TextButton, UpgradeBox, Background } from "./menuelements";
let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;

let windowID: number;
menu.style.display = "block";
game.style.display = "none";

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
    let mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      console.log(elements[i].type, i);
      if (elements[i].type == "Upgrade") {
        if (elements[i].detectClick(mousePos) == true) {
          console.log("true", i);
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
              break;
            case "campaign1":
              background.rendering = true;
              elements = [
                new TextButton(
                  50,
                  850,
                  "Back",
                  "200 25px Georgia",
                  true,
                  "menu",
                  "menu"
                ),
                new TextButton(
                  150,
                  400,
                  "Start Campaign",
                  "200 40px Georgia",
                  true,
                  "play",
                  "play"
                ),
              ];
              break;
            case "upgrade1":
              background.rendering = true;
              elements = [
                new UpgradeBox(150, 300, "Swords", "200 25px Georgia"),
                new UpgradeBox(150, 350, "Spears", "200 25px Georgia"),
                new UpgradeBox(150, 400, "Archery", "200 25px Georgia"),

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
