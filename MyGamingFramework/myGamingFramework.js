/*
** MyGamingFramework.js
** Sandro Gallo Software 2020
*/

function min(a,b) { return (a>b ? b : a); }
function max(a,b) { return (a>b ? a : b); }

class GameArea {
	constructor(w, h) {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = w;
		this.canvas.height = h;
	}
    display() {
		document.body.appendChild(this.canvas);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    download() {
        var tempLink = document.createElement('a');
        tempLink.download = "downloaded_image.jpg";
        tempLink.crossorigin="anonymous";
        var imageData = this.canvas.toDataURL("image/jpg");
        document.body.appendChild(tempLink);
        tempLink.href = imageData;
        tempLink.click();
        document.body.removeChild(tempLink);
    }
}

class GamePiece {
    constructor(w, h, ga, c="red", speed=6) {
        this.width=w; this.height=h;
        this.gamearea = ga;
        this.context = ga.context;
        this.xpos=ga.width/2-w; this.ypos=ga.height/2-h;
        this.dx = this.dy = speed;
        this.color = c;
    }
    draw(x, y) {
        this.xpos = x;
        this.ypos = y;
        this.context.fillStyle = this.color;
        this.context.fillRect(this.xpos, this.ypos, this.width, this.height);
    }
    clear() {
        this.context.clearRect(this.xpos, this.ypos, this.width, this.height);
    }
    move(x, y) {
        if (x<0 || x>=this.gamearea.canvas.width-this.width) return false;
        if (y<0 || y>=this.gamearea.canvas.height-this.height) return false;
        this.clear();
        this.draw(x, y);
        return true;
    }
    goRight() {
        this.move( this.xpos+this.dx, this.ypos );
    }
    goLeft() { 
        this.move( this.xpos-this.dx, this.ypos );
    }
    goUp() {
        this.move( this.xpos, this.ypos-this.dy );
    }
    goDown() {
        this.move( this.xpos, this.ypos+this.dy );
    }
}

class GameBall extends GamePiece {
    constructor(r, ga, c="red", speed=2) {
        super(2*r, 2*r, ga, c, speed);
        this.radius = r;
    }
    draw(x, y) {
        this.xpos = x;
        this.ypos = y;
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(x, y, this.radius, 0, 2*Math.PI);
        this.context.fill();
        this.context.closePath();
    }
	bounce() {
        if (this.xpos+this.dx<0 || this.xpos+this.dx>=this.gamearea.canvas.width-this.width) this.dx=-this.dx;
        if (this.ypos+this.dy<0 || this.ypos+this.dy>=this.gamearea.canvas.height-this.height) this.dy=-this.dy;
        this.context.clearRect(this.xpos-this.radius, this.ypos-this.radius, this.width, this.height);
        this.draw( this.xpos+this.dx, this.ypos+this.dy );
	}
    hit(otherPiece) {
        var dx = Math.abs(this.xpos-(otherPiece.xpos+otherPiece.width/2));
        var dy = Math.abs(this.ypos-(otherPiece.ypos+otherPiece.height/2));
        if (dx > this.radius+this.width/2) return false;
        if (dy > this.radius+this.height/2) return false;
        if (dx <= otherPiece.width) return true;
        if (dy <= otherPiece.height) return true;
        var ddx = dx-otherPiece.width;
        var ddy = dy-otherPiece.height;
        return ( ddx*ddx + ddy*ddy <= this.radius*this.radius );
    }
    isPointIn(x,y){
        var dx=x-this.xpos;
        var dy=y-this.ypos;
        return(dx*dx+dy*dy <= this.radius*this.radius);
    }
}

class GameImage extends GamePiece {
    constructor(src, ga, onloadfunction=null) {
		var i = new Image();
        if (onloadfunction!=null) i.onload = onloadfunction;
		i.src = src;
        super(i.width, i.height, ga);
        this.image = i;
    }
    draw(x, y, w=0, h=0) {
        var cRect = this.gamearea.canvas.getBoundingClientRect();
        var ctx = this.context;
		ctx.drawImage( this.image, x-cRect.left, y-cRect.top, (w>0 ? w : this.width), (h>0 ? h : this.height) );
    }
}
