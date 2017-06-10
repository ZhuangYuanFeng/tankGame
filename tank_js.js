/**
 * Created by MR.Zhuang.
 * direct 说明
 * 向上0
 * 向右1
 * 向下2
 * 向左3
 * x 表示横坐标, y 表示纵坐标, direct 方向，color颜色
 **/

/*定义一个炸弹类*/
function Bomb(x,y){
    this.x=x;
    this.y=y;
    this.isLive=true; //炸弹存在地图上为ture;
    this.blood=9;
    this.bloodDown=function(){
        if(this.blood>0){
            this.blood--;
        }
        else{
            this.isLive=false;
        }
    }
}

/*控制子弹来源，方向*/
function Bullet(x,y,direct,speed,type,tank){
    this.x=x;
    this.y=y;
    this.direct=direct;
    this.speed=speed;
    this.timer=null;
    this.isLive=true;
    this.type=type;
    this.tank=tank;
    this.run=function run(){
        if(this.x<=0||this.x>=512||this.y<=0||this.y>=480||this.isLive==false){  //判断子弹是否到地图边缘
            window.clearInterval(this.timer);
            this.isLive=false;
            if(this.type=="other"){
                this.tank.bulletIsLive=false;
            }
        }
        else{
            switch(this.direct){
                case 0:
                    this.y-=this.speed;
                    break;
                case 1:
                    this.x+=this.speed;
                    break;
                case 2:
                    this.y+=this.speed;
                    break;
                case 3:
                    this.x-=this.speed;
                    break;
            }
        }

    }
}

/*Tank是所有坦克的父类*/
function Tank(x,y,direct,color) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.isLive=true;
    this.direct = direct;
    this.color = color;
    /*向上移动*/
    this.moveUp=function(){
        this.y-=this.speed;
        this.direct=0;
    }
    /*向下移动*/
    this.moveDown=function(){
        this.y+=this.speed;
        this.direct=2;
    }
    /*向左移动*/
    this.moveLeft=function(){
        this.x-=this.speed;
        this.direct=3;
    }
    /*向右移动*/
    this.moveRight=function(){
        this.x+=this.speed;
        this.direct=1;
    }
}

/*己方坦克*/
function Mine_Tank(x,y,direct,color){
    Tank.call(this,x,y,direct,color);
    this.shotother=function(){
        switch(this.direct){
            case 0:
                minebt=new Bullet(this.x+9,this.y,this.direct,1,"mine",this);
                break;
            case 1:
                minebt=new Bullet(this.x+30,this.y+9,this.direct,1,"mine",this);
                break;
            case 2:
                minebt=new Bullet(this.x+9,this.y+30,this.direct,1,"mine",this);
                break;
            case 3:
                minebt=new Bullet(this.x,this.y+9,this.direct,1,"mine",this);
                break;
        }
        minebullets.push(minebt);
        var timer=window.setInterval("minebullets["+(minebullets.length-1)+"].run()",50);
        minebullets[minebullets.length-1].timer=timer;

    }
}

/*敌方坦克*/
function Other_Tank(x,y,direct,color){
    Tank.call(this,x,y,direct,color);
    this.count=0;
    this.bulletIsLive=true;

    this.run=function run(){
        //判断敌人的坦克当前方向
        switch(this.direct){

            case 0:
                if(this.y>0){
                    this.y-=this.speed;
                }
                break;
            case 1:
                if(this.x+30<512){
                    this.x+=this.speed;
                }
                break;
            case 2:
                if(this.y+30<480){
                    this.y+=this.speed;
                }
                break;
            case 3:
                if(this.x>0){
                    this.x-=this.speed;
                }
                break;
        }
        //走20次方向
        if(this.count>20){
            this.direct=Math.round(Math.random()*3);
            this.count=0;
        }
        this.count++;

        //判断子弹是否消失，消失在增加
        if(this.bulletIsLive==false){
            switch(this.direct){
                case 0:
                    obt=new Bullet(this.x+9,this.y,this.direct,1,"other",this);
                    break;
                case 1:
                    obt=new Bullet(this.x+30,this.y+9,this.direct,1,"other",this);
                    break;
                case 2:
                    obt=new Bullet(this.x+9,this.y+30,this.direct,1,"other",this);
                    break;
                case 3: //右
                    obt=new Bullet(this.x,this.y+9,this.direct,1,"other",this);
                    break;
            }
           /*添加子弹后启动*/
            otherbullets.push(obt);
            var reboot=window.setInterval("otherbullets["+(otherbullets.length-1)+"].run()",50);
            otherbullets[otherbullets.length-1].timer=reboot;
            this.bulletIsLive=true;
        }

    }
}

/*画出mine坦克子弹*/
function DrawMB(){
    for( var i=0;i<minebullets.length;i++){
        var minebt=minebullets[i];
        if(minebt!=null&&minebt.isLive){
            cxt.fillStyle="#fe1718";
            cxt.fillRect(minebt.x,minebt.y,2,2);
        }
    }

}

/*画出other坦克子弹*/
function DrawOB(){
    for( var i=0;i<otherbullets.length;i++){
        var obt=otherbullets[i];
        if(obt!=null&&obt.isLive){
            cxt.fillStyle="#fe1718";
            cxt.fillRect(obt.x,obt.y,2,2);
        }
    }

}

/*画出坦克*/
function DrawTank(tank){
    if(tank.isLive){
        switch(tank.direct){
            case 0:
            case 2:  //上下为一组，只是炮筒的坐标需要改变
                cxt.fillStyle=tank.color[0]; //设置颜色
                cxt.fillRect(tank.x,tank.y,5,30); //左边轮子
                cxt.fillRect(tank.x+15,tank.y,5,30); //右边轮子
                cxt.fillRect(tank.x+6,tank.y+5,8,20); //坦克的身体
                cxt.fillStyle=tank.color[1]; //绘制出坦克的头
                cxt.arc(tank.x+10,tank.y+15,4,0,2*Math.PI,true);
                cxt.fill();
                /*炮筒*/
                cxt.strokeStyle = tank.color[1];
                cxt.lineWidth=2;
                cxt.beginPath();
                cxt.moveTo(tank.x+10,tank.y+15);
                /*炮筒上下方向改变*/
                if(tank.direct==0){
                    cxt.lineTo(tank.x+10,tank.y);
                }
                else if(tank.direct==2){
                    cxt.lineTo(tank.x+10,tank.y+30);
                }
                cxt.closePath();
                cxt.stroke();
                break;
            case 1:
            case 3: //左右为一组，横纵坐标相反
                cxt.fillStyle=tank.color[0];
                cxt.fillRect(tank.x,tank.y,30,5);
                cxt.fillRect(tank.x,tank.y+15,30,5);
                cxt.fillRect(tank.x+5,tank.y+6,20,8);
                cxt.fillStyle=tank.color[1];
                cxt.arc(tank.x+15,tank.y+10,4,0,2*Math.PI,true);
                cxt.fill();
                cxt.strokeStyle = tank.color[1];
                cxt.lineWidth=1.5;
                cxt.beginPath();
                cxt.moveTo(tank.x+15,tank.y+10);
                /*炮筒左右方向改变*/
                if(tank.direct==1){
                    cxt.lineTo(tank.x+30,tank.y+10);
                }
                else if(tank.direct==3){
                    cxt.lineTo(tank.x,tank.y+10);
                }

                cxt.closePath();
                cxt.stroke();
                break;

        }
    }


}

/*可击中other坦克*/
function  HitOtherTank(){

    //取出每颗子弹
    for(var i=0;i<minebullets.length;i++){
        var mbt=minebullets[i];
        if(mbt.isLive){ //子弹存在
            for(var j=0;j<other.length;j++){

                var ot=other[j];

                if(ot.isLive){
                    switch(ot.direct){
                        case 0: //敌人坦克向上
                        case 2://敌人坦克向下
                            if(mbt.x>=ot.x&&mbt.x<=ot.x+20 &&mbt.y>=ot.y&&mbt.y<=ot.y+30){
                                ot.isLive=false;
                                //该子弹也消失
                                mbt.isLive=false;
                                var bomb=new Bomb(ot.x,ot.y);
                                bombs.push(bomb);
                            }
                            break;
                        case 1: //敌人坦克向右
                        case 3://敌人坦克向左
                            if(mbt.x>=ot.x&&mbt.x<=ot.x+30 &&mbt.y>=ot.y&&mbt.y<=ot.y+20){
                                ot.isLive=false;
                                mbt.isLive=false;
                                var bomb=new Bomb(ot.x,ot.y);
                                bombs.push(bomb);
                            }
                            break;

                    }

                }

            }
        }

    }
}

/*爆炸特效*/
function drawOtherBomb(){

    for(var i=0;i<bombs.length;i++){
        var bomb=bombs[i];
        if(bomb.isLive){
            if(bomb.blood>6){  //炸弹图大到小显示
                var img1=new Image();
                img1.src="imgs/bomb_1.gif";
                var x=bomb.x;
                var y=bomb.y;
                img1.onload=function(){
                    cxt.drawImage(img1,x,y,30,30);
                }
            }else if(bomb.blood>3){
                var img2=new Image();
                img2.src="imgs/bomb_2.gif";
                var x=bomb.x;
                var y=bomb.y;
                img2.onload=function(){
                    cxt.drawImage(img2,x,y,30,30);
                }
            }else {
                var img3=new Image();
                img3.src="imgs/bomb_3.gif";
                var x=bomb.x;
                var y=bomb.y;
                img3.onload=function(){
                    cxt.drawImage(img3,x,y,30,30);
                }
            }
            bomb.bloodDown();
            if(bomb.blood<=0){
                bombs.splice(i,1);

            }
        }
    }
}

