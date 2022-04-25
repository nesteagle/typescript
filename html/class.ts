class Point{
    x:number;
    y:number;
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    print():void{
        console.log(this.x,this.y);
    }
}
let point=new Point(6,10);
point.print();