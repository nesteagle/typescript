import { TextBox, TextButton, UpgradeBox, TreeBox, Background, Box } from "./menuelements";
let menu = document.getElementById("canvasmenu") as HTMLCanvasElement;
let game = document.getElementById("canvas") as HTMLCanvasElement;
let context = menu.getContext("2d") as CanvasRenderingContext2D;
let currency: number = 160000;
let exp: number = 4000;
let windowID: number;
let expbox, currencybox;
let mousePos;
let scrollxv = 0;
let scrollyv = 0;
export let scrollOffset = [0, 0];
let isScrolling = false;
window.addEventListener("keydown", KeyInput, false);
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
  scrollxv *= 0.93;
  scrollyv *= 0.93;
  scrollOffset[0] += scrollxv;
  scrollOffset[1] += scrollyv;
  background.draw();
  if (mousePos !== undefined) {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Button") {
        if (elements[i].hoveredOver(mousePos) !== true) {
          elements[i].restoreSize();
        }
      }
      if (elements[i].type == "UpgradeTree") {
        renderLines();
        if (elements[i].hoveredOver(mousePos) == true) {
          elements[i].selected = true;
        } else {
          elements[i].restoreSize();
          elements[i].selected = false;
        }
      }
    }
  }
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
menu.addEventListener("mousemove", function (event) {
  mousePos = getMousePos(menu, event);
});
menu.addEventListener(
  "click",
  function (event) {
    mousePos = getMousePos(menu, event);
    console.log(mousePos);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "Upgrade") {
        //Yes, I know that it counts when you click upgrade tree, I might implement it as a feature!
        if (elements[i].detectClick(mousePos) == true) {
          console.log(elements[i], upgrades[i - 2]);
          if (upgrades[i - 2] === undefined) break;
          if (upgrades[i - 2][1] == 0) {
            if (currency > 400) {
              currency -= 400;
              upgrades[i - 2][1]++;
            }
          } else if (currency > (upgrades[i - 2][1] + 1) * 400) {
            upgrades[i - 2][1]++;
            currency -= (upgrades[i - 2][1] + 1) * 400;
          }
          currencybox.text = `currency:${currency}`;
          currencybox.draw();
          break;
        }
      }
      if (elements[i].type == "UpgradeTree") {
        if (elements[i].detectClick(mousePos) == true) {
          console.log(elements[i]);
          if (hasPurchased(i) == false) {
            exp -= 100;
            expbox.text = `xp:${exp}`;
            expbox.draw();
            upgrades.push([elements[i].upgrade, 0]);
            switch (elements[i].path) {
              case "ranged1":
                elements.push(new TreeBox(450, 50, "Crossbows", "28px Georgia", "ranged3"));
                elements.push(new TreeBox(450, 300, "Longbows", "28px Georgia", "ranged2"));
                break;
              case "melee1":
                elements.push(new TreeBox(450.1, 600, "Axes", "28px Georgia", "melee2"));
                break;
              case "melee2":
                elements.push(new TreeBox(800.1, 600, "Horsemanship", "28px Georgia", "melee3"));
                break;
              case "ranged2":
                elements.push(new TreeBox(800, 300, "longbowpath", "28px Georgia", "ranged3"));
                break;
              case "ranged3":
                elements.push(new TreeBox(799.9, 50, "crossbowpath", "28px Georgia", "ranged2"));
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
            console.log(currency, upgrades);
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
                new TreeBox(100, 300, "Archery", "28px Georgia", "ranged1"),
                new TreeBox(100.1, 600, "Polearms", "28px Georgia", "melee1"),
                new TextBox(50, 50, `xp:${exp}`, "200 35px Georgia", false),
                new TextBox(50, 100, `currency:${currency}`, "200 35px Georgia", false),
              ];
              for (let i = 4; i < upgrades.length; i++) {
                switch (upgrades[i][0]) {
                  case "Archery":
                    elements.push(new TreeBox(450, 50, "Crossbows", "28px Georgia", "ranged3"));
                    elements.push(new TreeBox(450, 300, "Longbows", "28px Georgia", "ranged2"));
                    break;
                  case "Polearms":
                    elements.push(new TreeBox(450.1, 600, "Axes", "28px Georgia", "melee2"));
                    break;
                  case "Axes":
                    elements.push(new TreeBox(800.1, 600, "Horses", "28px Georgia", "melee3"));
                    break;
                  case "Longbows":
                    elements.push(new TreeBox(800, 300, "longbowpath", "28px Georgia", "ranged3"));
                    break;
                  case "Crossbows":
                    elements.push(new TreeBox(799.9, 50, "crossbowpath", "28px Georgia", "ranged2"));
                    break;
                }
              }
              isScrolling = true;
              scrollOffset = [0, 0];
              expbox = elements[elements.length - 2];
              currencybox = elements[elements.length - 1];
              break;
            case "upgrade3":
              elements = [
                new TextBox(150, 250, `currency:${currency}`, "200 35px Georgia", false),
                new TextButton(50, 850, "Back", "200 25px Georgia", true, "menu", "upgrade1"),
              ];
              for (i = 0; i < upgrades.length; i++) {
                elements.push(new UpgradeBox(150, i * 50 + 300, upgrades[i][0], "200 25px Georgia"));
              }
              currencybox = elements[0];
              break;
          }
        }
      }
    }
  },
  false
);
function KeyInput(event: KeyboardEvent) {
  if (isScrolling == true) {
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
        scrollxv += 2;
        break;
      case "Right":
      case "ArrowRight":
        scrollxv -= 2;
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
      if (elements[i].x == elements[j].x && elements[i].type == "UpgradeTree" && elements[j].type == "UpgradeTree") {
        for (let k = 0; k < upgrades.length; k++) {
          if (upgrades[k][0] == elements[i].upgrade) {
            context.fillRect(elements[i].x + 60, elements[i].y, 10, elements[j].y - elements[i].y);
          }
        }
        continue;
      }
      if (elements[i].y == elements[j].y && elements[i].type == "UpgradeTree" && elements[j].type == "UpgradeTree") {
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
