let dogState = "stand";
const dropdown = document.getElementById('animation');
dropdown.addEventListener('change', function(e){
    dogState = e.target.value;
})

const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const player1img = new Image();
player1img.src = "dog.png";
const spriteWidth = 575;/* spritesheet width divided by colums from left to right(colums: amount of enemy pics) - crops one image from the sheet */
const spriteHeight = 523;/* spritesheet height diveded by colums from up to down*/


let gameFrame = 0;
const staggerFrames = 5;
const spriteAnimation = [];
const animationStates = [ /*tells how many colums each row has */
    {
        name: 'stand',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'land',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    }
];
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimation[state.name] = frames;
});
console.log(animationStates);

function animation() { 
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimation[dogState].loc.length; /*makes it possible to change the animation without having to manually change the frame count */
    let frameX = spriteWidth * position;
    let frameY = spriteAnimation[dogState].loc[position].y; /*makes it possible to change the animation (/spritsheet row) without having to manually change the frame count */
    ctx.drawImage(player1img, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight); //draws the chosen image (dog.png in this case)
    if (gameFrame % staggerFrames == 0) {
        if (frameX < 6) frameX++; /* makes the frames move to create an animation loop */
        else frameX = 0; /*returns the value back to start when the loop is over */
    }
    gameFrame++;
    requestAnimationFrame(animation);
};
animation();
