var canva=document.getElementById("Canvas");
var ctx=canva.getContext("2d");

var particle = [], w,h;     //粒子数组，浏览器宽高
var delay=200,tip;

//为了确保canvas能够充满整个浏览器，所以要将canvas的宽高设置成和浏览器一样：
function getsize(){
	w=canva.width=window.innerWidth;	//画布宽
	h=canva.height=window.innerHeight;	//画布高
}

//定义粒子的参数
var opt={
	particleAmount:50,	//粒子个数
	defaultSpeed:0.1,		//粒子运动速度
	variantSpeed:0.1,		//粒子运动速度的变量
	particleColor:"rgb(32,245,245)",	//粒子的颜色
	lineColor:"rgb(32,245,245)",		//粒子连线的颜色
	defaultRadius:2,	//粒子的半径
	variantRadius:2,	//粒子半径的变量
	minDistance:200		//粒子连线的最小距离
};

var line=opt.lineColor.match(/\d+/g);//正则表达式获得线条r，g，b的数值

//在浏览器窗口大小改变以后有些粒子就会消失不见，需要监听浏览器大小是否改变：
window.addEventListener("resize",function(){
	winResize();
})

//初始化粒子
function Partical(){
	this.x=Math.random()*w;	//x坐标
	this.y=Math.random()*h;	//y坐标
	this.speed=opt.defaultSpeed+opt.variantSpeed*Math.random();//运动的速度
	this.radius=opt.defaultRadius+Math.random()*opt.variantRadius;//粒子的半径
	this.color=opt.particleColor;						//粒子的颜色
	this.directionAngle=Math.floor(Math.random()*360);//生成的随机运动角度
	this.vector={
		x:this.speed*Math.cos(this.directionAngle),//x方向的运动速度
		y:this.speed*Math.sin(this.directionAngle)//y方向的运动速度
	}

	//粒子更新函数
	this.update=function(){
		this.border();//边界判断
		this.x+=this.vector.x;//下一时刻在x的位置
		this.y+=this.vector.y;//下一时刻在y的位置
	}

	//判断粒子是否到达边界
	this.border=function(){
		if(this.x>=w||this.x<=0){ //到达左右边界，反方向运动
			this.vector.x*=-1;
		}
		if(this.y>=h||this.y<=0){ //到达上下边界，反方向运动
			this.vector.y*=-1;
		}
		//当放大或缩小窗口时
		if(this.x>w){
			this.x=w;
		}
		if(this.x<0){
			this.x=0;
		}
		if(this.y>h){
			this.y=h;
		}
		if(this.y<0){
			this.y=0;
		}
	}

	//绘制一个粒子
	this.draw=function(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		ctx.closePath();
		ctx.fillStyle=this.color;
		ctx.fill();
	}
}//初始化粒子结束

//在画布上绘制粒子
function init(){
	getsize();
	for(i=0;i<opt.particleAmount;i++){
		particle.push(new Partical());
	}
	loop();
}

function loop(){
	ctx.clearRect(0,0,w,h);//清除矩阵,不清除的话，颜色会一直积累。
	for(j=0;j<opt.particleAmount;j++){
		particle[j].update();
		particle[j].draw();
	}
	for(m=0;m<opt.particleAmount;m++){
		linePoint(particle[m],particle);
	}
	window.requestAnimationFrame(loop);
}

function winResize(){
	clearTimeout(tip); //在setTimeout重新运行前终止上一次的运行。
	tip=setTimeout(function(){
		getsize();
	},delay);
}

//确定两个粒子之间的距离
function getDistance(point1,point2){
	return Math.sqrt(Math.pow(point1.x-point2.x,2)+Math.pow(point1.y-point2.y,2));
}



//两个粒子距离越近，越不透明，距离越远，越透明
function linePoint(point,hub){
	for(k=0;k<hub.length;k++){
		var distance=getDistance(point,hub[k]);
		var opacity=1-distance/opt.minDistance; //值越小，越透明
		if(opacity>0){		//说明两个粒子之间的距离小于最小距离
			ctx.lineWidth=0.5;	//粒子连接时的线条宽度
			ctx.beginPath();	//绘制路径
			ctx.moveTo(point.x,point.y);	//移动到该点
			ctx.lineTo(hub[k].x,hub[k].y)
			ctx.closePath();	//停止绘制
			ctx.strokeStyle="rgba("+line[0]+","+line[1]+","+line[2]+")";  //绘制路径的颜色
			ctx.stroke();	//绘制
		}
	}
}

init();