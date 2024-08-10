const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 4;
//let gameFrame = 0;
//this part creates backgroundlayers
const backgroundLayer1 = new Image();
backgroundLayer1.src = '1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '5.png';
const backgroundLayer6 = new Image();
backgroundLayer6.src = '6.png';
const backgroundLayer7 = new Image();
backgroundLayer7.src = '7.png';

window.addEventListener('load', function(){

const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener('change', function(e){
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = gameSpeed;
})

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width){
            this.x = 0;
        }
        this.x = this.x - this.speed;
        //this.x = gameFrame * this.speed % this.width;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
//this part makes background "endless" and numbers in the end indicates spees = creates illusion of depth
const layer1 = new Layer(backgroundLayer1, 0.6);
const layer2 = new Layer(backgroundLayer2, 0.8);
const layer3 = new Layer(backgroundLayer3, 1.0);
const layer4 = new Layer(backgroundLayer4, 1.2);
const layer5 = new Layer(backgroundLayer5, 1.4);
const layer6 = new Layer(backgroundLayer6, 0.4);
const layer7 = new Layer(backgroundLayer7, 0.2);

const gameObjects = [layer7, layer6, layer1, layer2, layer3,layer4, layer5];

//this animates the background
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    //gameFrame--;
    requestAnimationFrame(animate);
};
animate();
});