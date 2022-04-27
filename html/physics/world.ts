import { Ball } from "./ball";

let canvas=document.getElementById("canvas") as HTMLCanvasElement;
let context=canvas.getContext("2d") as CanvasRenderingContext2D;

let xv:number=5,yv:number=0;
let ball=new Ball(0,0,30)

function update():void{
    window.requestAnimationFrame(update);
    context.clearRect(0, 0, canvas.width, canvas.height);
    yv+=1;
    yv*=0.99
    ball.x+=xv;
    ball.y+=yv;
    ball.draw();
    if (ball.y>canvas.height){
        yv=-(yv+2)
    }
    if (ball.x>canvas.width||ball.x<0) xv=-xv;
}
update();