import { TextBox, TextButton, UpgradeBox, TreeBox, Background } from "./menuelements";
let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let currency: number = 160000;
let exp: number = 4000;
let windowID: number;
let textbox;
menu.style.display = "block";
game.style.display = "none";
export let upgrades: Array<any> = [
  ["Swords", 0],
  ["Spears", 0],
  ["Speed", 0],
  ["Armor", 0],
];

let background = new Background(0, 0, false);
let elements: Array<any> = [
  new TextBox(100, 200, "Game Title", "600 90px Georgia", true),
  new TextButton(100, 500, "Play Campaign", "200 45px Georgia", true, "menu", "campaign1"),
  new TextButton(100, 600, "Upgrades", "200 45px Georgia", true, "menu", "upgrade1"),
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
  context.save();
  background.draw();
  for (let i = 0; i < elements.length; i++) {
    elements[i].draw();
  }
  context.restore();
}
update();
function hasPurchased(index) {
  for (let i = 0; i < upgrades.length; i++) {
    console.log(upgrades[i][0], elements[index].upgrade, elements[index].upgrade == upgrades[i][0]);
    if (elements[index].upgrade == upgrades[i][0]) {
      return true;
    }
  }
  return false;
}
menu.addEventListener(
  "click",
  function (event) {
    let mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Upgrade") {
        if (elements[i].detectClick(mousePos) == true) {
          if (upgrades[i][1] == 0) {
            if (currency > 400) {
              currency -= 400;
              upgrades[i][1]++;
            }
          } else if (currency > (upgrades[i][1] + 1) * 400) {
            upgrades[i][1]++;
            currency -= (upgrades[i][1] + 1) * 400;
          }
          //console.log("true", i);
          textbox.text = `currency:${currency}`;
          textbox.draw();
          break;
        }
      }
      if (elements[i].type == "UpgradeTree") {
        if (elements[i].detectClick(mousePos) == true) {
          console.log(elements[i]);
          if (hasPurchased(i) == false) {
            exp -= 100;
            textbox.text = `xp:${exp}`;
            textbox.draw();
            upgrades.push([elements[i].upgrade, 0]);
            switch (elements[i].path) {
              case "ranged1":
                elements.push(new TreeBox(350, 100, "Crossbows", "28px Georgia", "ranged3"));
                elements.push(new TreeBox(350, 300, "Longbows", "28px Georgia", "ranged2"));
                break;
              case "melee1":
                elements.push(new TreeBox(350, 500, "Axes", "28px Georgia", "melee2"));
                break;
              case "melee2":
                elements.push(new TreeBox(550, 500, "Horsemanship", "28px Georgia", "melee3"));
                break;
              case "ranged2":
                elements.push(new TreeBox(550, 300, "longbowpath", "28px Georgia", "ranged3"));
                break;
              case "ranged3":
                elements.push(new TreeBox(550, 100, "crossbowpath", "28px Georgia", "ranged2"));
                break;
            }
          }
          console.log(upgrades);
        }
      }
      if (elements[i].type == "Button") {
        if (elements[i].detectClick(mousePos) == true) {
          switch (elements[i].path) {
            case "menu":
              background.rendering = false;
              elements = [
                new TextBox(100, 200, "Game Title", "600 90px Georgia", true),
                new TextButton(100, 500, "Play Campaign", "200 45px Georgia", true, "menu", "campaign1"),
                new TextButton(100, 600, "Upgrades", "200 45px Georgia", true, "menu", "upgrade1"),
              ];
              break;
            case "campaign1":
              background.rendering = true;
              elements = [
                new TextButton(50, 850, "Back", "200 25px Georgia", true, "menu", "menu"),
                new TextButton(150, 400, "Start Campaign", "200 40px Georgia", true, "play", "play"),
              ];
              break;
            case "upgrade1":
              background.rendering = true;
              elements = [
                new TextButton(50, 850, "Back", "200 25px Georgia", true, "menu", "menu"),
                new TextButton(150, 400, "Tech Tree", "200 40px Georgia", true, "menu", "upgrade2"),
                new TextButton(150, 500, "My Upgrades", "200 40px Georgia", true, "menu", "upgrade3"),
              ];
              break;
            case "upgrade2":
              elements = [
                new TextButton(50, 850, "Back", "200 25px Georgia", true, "menu", "upgrade1"),
                new TreeBox(150, 300, "Archery", "28px Georgia", "ranged1"),
                new TreeBox(150, 500, "Polearms", "28px Georgia", "melee1"),
                new TextBox(150, 150, `xp:${exp}`, "200 35px Georgia", false),
              ];
              textbox = elements[elements.length - 1];

              break;

            case "upgrade3":
              elements = [
                // new UpgradeBox(150, 300, "Swords", "200 25px Georgia"),
                // new UpgradeBox(150, 350, "Spears", "200 25px Georgia"),
                // new UpgradeBox(150, 400, "Archery", "200 25px Georgia"),
                // new UpgradeBox(150, 450, "Halberds", "200 25px Georgia"),
                // new UpgradeBox(150, 500, "Axes", "200 25px Georgia"),
                // new UpgradeBox(150, 550, "Armor", "200 25px Georgia"),
                // new UpgradeBox(150, 600, "Speed", "200 25px Georgia"),
                new TextBox(150, 250, `currency:${currency}`, "200 35px Georgia", false),
                new TextButton(50, 850, "Back", "200 25px Georgia", true, "menu", "upgrade1"),
              ];
              for (i = 0; i < upgrades.length; i++) {
                elements.push(new UpgradeBox(150, i * 50 + 300, upgrades[i][0], "200 25px Georgia"));
              }
              textbox = elements[0];
              break;
          }
        }
      }
    }
  },
  false
);
