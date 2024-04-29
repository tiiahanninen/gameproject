const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const impactCanvas = document.getElementById('impactCanvas'); /* in video collisionCanvas*/
const impactCtx = impactCanvas.getContext('2d'); /* in video "collisionCtx"*/
impactCanvas.width = window.innerWidth;
impactCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = '50px Impact';

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
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50; /* ramdomizes flaps*/
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]; /* gives color for an enemy*/
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltatime){ /* with deltatime adjust the speed of wings, deltatime is dependent on the power of computer*/
    if (this.y < 0 || this.y > canvas.height - this.height){
        this.directionY = this.directionY * -1;
        } /* disables "disappering" from screen, when enemy hits top/low part of screen makes new route*/
        this.x -= this.directionX;
        this.y += this.directionY; /* enables vertival movement*/
        if (this.x <0 - this.width) this.markedForDelete = true; /*HUOM VIDEOSSA "markedForDeletion" - Deletes the enemies that reach the left edge */
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0; /* returns the animation to the frame 1 */
            else this.frame++; /*loops the frames, creates the flapping animation*/
            this.timeSinceFlap = 0;
        }
        if (this.x < 0 - this.width) gameOver = true;
    }
    draw(){
        impactCtx.fillStyle = this.color;
        impactCtx.fillRect(this.x, this.y, this.width, this.height); /*rectangle as the enemy */
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); /* cuts the images from the sheet  */
    }
}
let explosions = [];
class Explosion { /* creates blueprint for ~ explosions ~*/
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDelete = false; //HUOM videossa markedForDeletion
    }
    update(deltatime){   /* this function enables right timing for effect*/
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            if (this.frame > 5) this.markedForDelete = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y - this.size/4, this.size, this.size);
    }
}


const enemy = new Enemy();

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score; ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score; ' + score, 55, 80);
}
function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2 + 5, canvas.height/2 + 5);
}

window.addEventListener('click', function(e) {
    const detectPixelColor = impactCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    enemies.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            // impact detected
            object.markedForDelete = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    });
});

/* HUOM VIDEOSSA "animate"! - animation loop using deltatime: */ 
function animation(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    impactCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextEnemy += deltatime;
    if (timeToNextEnemy > enemyInterval) { /*sets the time inbetween the spawn of new enemies regardles of how powerfull ones device is */
        enemies.push(new Enemy());
        enemies.sort(function(a, b) {
            return a.width - b.width;
        }); /* sorts enemies; smaller ones are behind biggers so it makes illusion of depth*/
    }
    drawScore();
    [...enemies, ...explosions].forEach(object => object.update(deltatime)); /*cycles trough the enemies array and triggers update */
    [...enemies, ...explosions].forEach(object => object.draw()); /* makes multiple enemies appear at the same time */
    enemies = enemies.filter(object => !object.markedForDelete); /*HUOM VIDEOSSA "markedForDeletion" */
    explosions = explosions.filter(object => !object.markedForDelete);
    if (!gameOver) requestAnimationFrame(animation);
    else drawGameOver();
}
animation(0); /* 0 to give a starting value for the timestamp so it works together with deltatime */

