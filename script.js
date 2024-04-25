const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextEnemy = 0;
let enemyInterval = 500;
let lastTime = 0;

/* creating the enemies */
let enemies = [];
class Enemy {
    constructor(){
        this.spriteWidth = 60; /* area from the sprite sheet that we want visible - sprite sheet/wanted amount of frames(in this case flies) */
        this.spriteHeight = 44; /* area from the sprite sheet that is wanted visible */
        this.sizeModifier = Math.random() * 1.2 + 0.9; /*size of the enemies varies */
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);  
        this.directionX = Math.random() * 5 + 3; /* making the enemies to move on the X axel */
        this.directionY = Math.random() * 5 - 2.5; /* making the enemies spawn from different places on Y axel */
        this.markedForDelete = false; 
        this.image = new Image();
        this.image.src = 'enemy.png';
        this.frame = 0; /*animation/frames start from the first fly */
        this.maxFrame = 5; /*last frame is the fly number 6  */
    }
    update(){
        this.x -= this.directionX;
        if (this.x <0 - this.width) this.markedForDelete = true; /*HUOM VIDEOSSA "markedForDeletion" - Deletes the enemies that reach the left edge */
        if (this.frame > this.maxFrame) this.frame = 0; /* returns the animation to the frame 1 */
        else this.frame++; /*loops the frames, creates the flapping animation*/
    }
    draw(){
        ctx.strokeRect(this.x, this.y, this.width, this.height); /*rectangle as the enemy */
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); /* cuts the images from the sheet  */
    }
}

const enemy = new Enemy();

/* HUOM VIDEOSSA "animate"! - animation loop using deltatime: */ 
function animation(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextEnemy += deltatime;
    if (timeToNextEnemy > enemyInterval) { /*sets the time inbetween the spawn of new enemies regardles of how powerfull ones device is */
        enemies.push(new Enemy());
        timeToNextEnemy = 0;
    };
    [...enemies].forEach(object => object.update(deltatime)); /*cycles trough the enemies array and triggers update */
    [...enemies].forEach(object => object.draw()); /* makes multiple enemies appear at the same time */
    enemies = enemies.filter(object => !object.markedForDelete); /*HUOM VIDEOSSA "markedForDeletion" */
    requestAnimationFrame(animation);
}
animation(0); /* 0 to give a starting value for the timestamp so it works together with deltatime */