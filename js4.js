const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x,y){
        this.spriteWidth = 100; // divides the squares from spreadsheet
        this.spriteHeight = 90; // divides the squares from spreadsheet
        this.width = this.spriteWidth * 0.7; //makes sure the image won't be squished, makes it scale
        this.height = this.spriteHeight * 0.7; //makes sure the image won't be squished, makes it scale
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0; //returns the image back to square one
        this.timer = 0;
        this.angle = Math.random() * 6.2;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
    }

    update(){
        if (this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 10 === 0){  //slows down the animation
            this.frame++; // display the animation step by step
        }
    }
    draw(){ //draws the wanted square and makes the first square/screen rotate (so all the explosions won't look the same)
        ctx.save(); // enables the rotation for only one draw call
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle); //random angle value
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.width/2, this.width, this.height)
        ctx.restore();
    }
}

window.addEventListener('click', function(e){
    createAnimation(e);
});

function createAnimation(e){ // to avoid hard coding, added a function that is being called in the event listener
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY)); 
}

function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].frame >5){
            explosions.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animation);
}
animation();