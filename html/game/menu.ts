let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
class TextBox {
  constructor(public x, public y, public text, public font) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
  }
  draw(): void {
    context.font = this.font;
    context.fillText(this.text, this.x, this.y);
    console.log("drawn");
  }
  detectClick(mousePos): void {
    let measurements = context.measureText(this.text);
    if (
      mousePos.x > this.x &&
      mousePos.x < this.x + measurements.width &&
      mousePos.y < this.y + measurements.fontBoundingBoxDescent &&
      mousePos.y > this.y - measurements.fontBoundingBoxAscent
    ) {
      console.log("in bounds");
    } else {
    }
  }
}
let text = new TextBox(100, 100, "GameTitle", "600 90px Georgia");
text.draw();
let text2 = new TextBox(400, 400, "click detection", "30px Georgia");
text2.draw();
function getMousePos(canvas, event) {
  let bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
canvas.addEventListener(
  "click",
  function (event) {
    let mousePos = getMousePos(canvas, event);
    console.log(mousePos);
    text2.detectClick(mousePos);
  },
  false
);
