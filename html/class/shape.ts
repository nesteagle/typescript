export class Triangle{
    public x:number;
    public y:number;
    public size:number;
    private context:CanvasRenderingContext2D;
    constructor(x,y,size?){
        this.x=x;
        this.y=y;
        size==undefined?this.size=75:this.size=size
        let canvas=document.getElementById("canvas") as HTMLCanvasElement;
        let context=canvas.getContext("2d");
        this.context=context!;
    }
    draw=():void=>{
        this.context.beginPath();
        this.context.moveTo(this.size/2,0);
        this.context.lineTo(this.size,this.size);
        this.context.lineTo(0,this.size);
        this.context.lineTo(this.size/2,0);
        this.context.fill();
    }
}