import { Text, UpgradeBox, Box, Background, Minimap, InteractiveBox } from "./menuelements";
import { playerStats } from "./world";
let drag = false;
document.addEventListener("mousedown", () => (drag = false));
document.addEventListener("mousemove", () => (drag = true));
document.addEventListener("mouseup", () => console.log(drag ? "drag" : "click"));
let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let currency: number = 160000;
let exp: number = 4000;
let windowID: number;
let expbox: any, currencybox: any, minimap: any;
let mousePos: any;
let scrollxv: number = 0;
let scrollyv: number = 0;
let eventListener: any = document.getElementById("listener");
export let lostGame = new CustomEvent("event", { detail: { won: false } });
export let wonGame = new CustomEvent("event", { detail: { won: true } });
export let scrollOffset: Array<number> = [0, 0];
window.addEventListener("keydown", KeyInput, false);
menu.style.display = "block";
game.style.display = "none";
export let upgrades: Array<any> = [
  ["Swords", 0],
  ["Spears", 0],
];
let background = new Background(0, 0, false);
export let elements: Array<any> = [
  new Text(100, 200, "Game Title", "600 90px Georgia", false, false, true),
  new Text(100, 450, "Play Campaign", "200 45px Georgia", true, true, true, null, "campaign1"),
  new Text(100, 550, "Upgrades", "200 45px Georgia", true, true, true, null, "upgrade1"),
  new Text(100, 650, "Loadout", "200 45px Georgia", true, true, true, null, "equip"),
];
function getMousePos(canvas, event) {
  let bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
eventListener.addEventListener(
  "event",
  function (e) {
    let won: string;
    let colortemp: string;
    menu.style.display = "block";
    game.style.display = "none";
    if (e.detail !== null) {
      if (e.detail.won == true) {
        colortemp = "rgb(32,60,32)";
        won = "were victorious!";
      } else {
        colortemp = "rgb(60,32,32)";
        won = "were defeated!"; //add art when assets are designed :o
      }
    }
    elements = [
      new Text(100, 100, "You " + won, "500 50px Georgia", false, false),
      new Text(100, 200, "Total Kills: " + playerStats[0].kills, "100 35px Georgia", false, false),
      new Text(100, 260, "Total Deaths:" + playerStats[1].deaths, "100 35px Georgia", false, false),
      new Text(100, 320, "Kill-Death Ratio: " + playerStats[0].kills / +playerStats[1].deaths, "100 35px Georgia", false, false),
      new Text(100, 400, "Units Crossed: " + playerStats[2].crosses, "100 35px Georgia", false, false),
      new Text(100, 600, "Return to Menu", "200 45px Georgia", true, true, null, "menu"),
    ];
    elements[0].textColor = colortemp;
    scrollOffset = [0, 0];
    scrollxv = 0;
    scrollyv = 0;
    update();
  }.bind(this)
);
function update() {
  windowID = window.requestAnimationFrame(update);
  context.fillStyle = "black";
  context.save();
  scrollxv *= 0.93;
  scrollyv *= 0.93;
  scrollOffset[0] -= scrollxv;
  scrollOffset[1] += scrollyv;
  background.draw();
  if (mousePos !== undefined) {
    for (let i = 0; i < elements.length; i++) {
      handleClick(elements[i], i);
      switch (elements[i].type) {
        case "Upgrade":
          renderLines();
          break;
      }
      handleInteraction(elements[i], i);
    }
  }
  for (let j = 0; j < elements.length; j++) {
    elements[j].draw();
  }
  if (minimap !== undefined) minimap.draw();
  context.restore();
}
update();
function hasPurchased(index) {
  for (let i = 0; i < upgrades.length; i++) {
    if (elements[index].upgrade == upgrades[i][0]) {
      return true;
    }
  }
  return false;
}
menu.addEventListener("mousemove", function (event) {
  mousePos = getMousePos(menu, event);
});
menu.addEventListener(
  "click",
  function (event) {
    mousePos = getMousePos(menu, event);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Upgrade") {
        if (elements[i].detectClick(mousePos) == true) {
          if (hasPurchased(i) == false) {
            exp -= 100;
            expbox.text = `xp:${exp}`;
            expbox.draw();
            upgrades.push([elements[i].upgrade, 0]);
            switch (elements[i].path) {
              case "ranged1":
                elements.push(new UpgradeBox(750, 300, "Longbows", "ranged2"));
                break;
              case "melee1":
                elements.push(new UpgradeBox(750.1, 600, "Axes", "melee2"));
                break;
              case "melee2":
                elements.push(new UpgradeBox(1100.1, 600, "Horsemanship", "melee3"));
                break;
              case "ranged2":
                elements.push(new UpgradeBox(750, 50, "Crossbows", "ranged3"));
                elements.push(new UpgradeBox(1100, 300, "longbowpath", "ranged3"));
                break;
              case "ranged3":
                elements.push(new UpgradeBox(1099.9, 50, "crossbowpath", "ranged2"));
                break;
            }
          } else {
            for (let k = 0; k < upgrades.length; k++) {
              if (upgrades[k][0] == elements[i].upgrade) {
                if (upgrades[k][1] == 0) {
                  if (currency > 400) {
                    currency -= 400;
                    upgrades[k][1]++;
                  }
                } else if (currency > (upgrades[k][1] + 1) * 400) {
                  upgrades[k][1]++;
                  currency -= (upgrades[k][1] + 1) * 400;
                }
              }
            }
            currencybox.text = `currency:${currency}`;
            currencybox.draw();
          }
        }
      }
      if (elements[i].type == "Button") {
        if (elements[i].detectClick(mousePos) == true) {
          switch (elements[i].path) {
            case "menu":
              background.rendering = false;
              elements = [
                new Text(100, 200, "Game Title", "600 90px Georgia", false, false, true),
                new Text(100, 450, "Play Campaign", "200 45px Georgia", true, true, true, null, "menu", "campaign1"),
                new Text(100, 550, "Upgrades", "200 45px Georgia", true, true, true, null, "upgrade1"),
                new Text(100, 650, "Loadout", "200 45px Georgia", true, true, true, null, "equip"),
              ];
              minimap = undefined;
              break;
            case "campaign1":
              background.rendering = true;
              elements = [
                new Text(50, 850, "Back", "200 25px Georgia", true, true, true, null, "menu"),
                new Text(150, 400, "Start Campaign", "200 40px Georgia", true, true, true, null, "play"),
              ];
              break;
            case "upgrade1":
              background.rendering = true;
              elements = [
                new Text(50, 850, "Back", "200 25px Georgia", true, true, true, null, "menu"),
                new Text(150, 400, "Tech Tree", "200 40px Georgia", true, true, true, null, "upgrade2"),
              ];
              break;
            case "upgrade2":
              elements = [
                new Text(50, 850, "Back", "200 25px Georgia", true, true, true, null, "upgrade1"),
                new UpgradeBox(400, 300, "Archery", "ranged1"),
                new UpgradeBox(400.1, 600, "Polearms", "melee1"),
                new UpgradeBox(50, 600, "Swords"),
                new UpgradeBox(50, 300, "Spears"),
                new Minimap(990, 690),
                new Text(50, 50, `xp:${exp}`, "200 35px Georgia", false, false),
                new Text(50, 100, `currency:${currency}`, "200 35px Georgia", false, false),
              ];
              for (let i = 4; i < upgrades.length; i++) {
                switch (upgrades[i][0]) {
                  case "Archery":
                    elements.push(new UpgradeBox(750, 300, "Longbows", "ranged2"));
                    break;
                  case "Polearms":
                    elements.push(new UpgradeBox(750.1, 600, "Axes", "melee2"));
                    break;
                  case "Axes":
                    elements.push(new UpgradeBox(1100.1, 600, "Horses", "melee3"));
                    break;
                  case "Longbows":
                    elements.push(new UpgradeBox(750, 50, "Crossbows", "ranged3"));
                    elements.push(new UpgradeBox(1100, 300, "longbowpath", "ranged3"));
                    break;
                  case "Crossbows":
                    elements.push(new UpgradeBox(1099.9, 50, "crossbowpath", "ranged2"));
                    break;
                }
              }
              scrollOffset = [0, 0];
              minimap = elements[elements.length - 2];
              expbox = elements[elements.length - 2];
              currencybox = elements[elements.length - 1];
              minimap.Scrolling = true;
              break;
            case "equip":
              background.rendering = true;
              elements = [new Text(50, 850, "Back", "200 25px Georgia", true, true, null, "menu")];
              elements.push(
                new Box(500, 500, 100, 100, true, "Hello", "Hello world!\nThis is a test to see\nif multiple lines\nwork!", "40px Georgia"),
                new InteractiveBox(
                  400,
                  650,
                  100,
                  100,
                  "Hello",
                  "Hello world! this box is\nanother test which is seperate\n from the original box.",
                  "30px Georgia",
                  "rgb(100,100,100)"
                )
              );
              break;
          }
        }
      }
    }
  },
  false
);
function KeyInput(event: KeyboardEvent) {
  if (minimap == undefined) return;
  if (minimap.Scrolling == true) {
    switch (event.key) {
      case "Up":
      case "ArrowUp":
        scrollyv += 2;
        break;
      case "Down":
      case "ArrowDown":
        scrollyv -= 2;
        break;
      case "Left":
      case "ArrowLeft":
        scrollxv -= 2;
        break;
      case "Right":
      case "ArrowRight":
        scrollxv += 2;
        break;
      case "r":
        scrollOffset = [0, 0];
        scrollxv = 0;
        scrollyv = 0;
        break;
    }
  }
}
function renderLines() {
  context.translate(scrollOffset[0], scrollOffset[1]);
  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < elements.length; j++) {
      if (elements[i].x == elements[j].x && elements[i].type == "Upgrade" && elements[j].type == "Upgrade") {
        for (let k = 0; k < upgrades.length; k++) {
          if (upgrades[k][0] == elements[i].upgrade) {
            context.fillRect(elements[i].x + 60, elements[i].y, 10, elements[j].y - elements[i].y);
          }
        }
        continue;
      }
      if (elements[i].y == elements[j].y && elements[i].type == "Upgrade" && elements[j].type == "Upgrade") {
        for (let k = 0; k < upgrades.length; k++) {
          if (upgrades[k][0] == elements[i].upgrade) {
            context.fillRect(elements[i].x, elements[i].y + 60, elements[j].x - elements[i].x, 10);
          }
        }
        continue;
      }
    }
  }
  context.translate(-scrollOffset[0], -scrollOffset[1]);
}
interface interactive {
  selectable: boolean;
}
interface clickable {
  clickable: boolean;
}
function isInteractive(object: any): object is interactive {
  return "selectable" in object;
}
function isClickable(object: any): object is interactive {
  return "clickable" in object;
}
function handleClick(obj: clickable, index: number) {
  if (isClickable(obj)) {
    if (obj.clickable == true) {
      if (elements[index].hoveredOver(mousePos) !== true) {
        elements[index].restoreSize();
      }
    }
  }
}
function handleInteraction(obj: interactive, index: number) {
  if (isInteractive(obj)) {
    if (obj.selectable == true) {
      if (elements[index].hoveredOver(mousePos) == true) {
        elements[index].selected = true;
      } else {
        if (elements[index].type == "Upgrade" || elements[index].type == "Box") elements[index].restoreSize();
        elements[index].selected = false;
      }
    }
  }
}
