var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, gameOverImg;
var restart, restartImg;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var starsGroup, starImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var checkPointSound, jumpSound;

var score;

var backgroundImage

localStorage["HighestScore"] = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  starImage = loadImage("Star.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  checkPointSound = loadSound("checkPoint.mp3");
  jumpSound = loadSound("jump.mp3");     
  
  backgroundImage = loadImage("BACKGROUNDFORTREX.gif");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  starsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300,80);
  restart = createSprite(300,120);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  gameOver.visible = false;
  restart.visible = false;

  console.log(ground.x);
  
  textSize(30);
  textFont("Agency FB");
  fill("orange");
  textStyle(BOLD);
}

function draw() {
  background(backgroundImage);
  //image(backgroundImage, 200, 200);
  
  text("Score: "+ score, camera.position.x + 150,50);
  
  if (localStorage["HighestScore"] < score){
      localStorage["HighestScore"] = score;
    }
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    if(score % 100 === 0 && score > 0){
      checkPointSound.play(); 
    }
    
    if(keyDown("space") && trex.y >= 159) {
    trex.velocityY = -15;
    jumpSound.play();
    }

    //trex.collide(ground);
    
    trex.velocityY = trex.velocityY + 0.8
    invisibleGround.x = trex.x;

    trex.x = camera.position.x - 250;

    //ground.x = ground.x - 4;

    camera.position.x = camera.position.x + 4;
    
    //=ground.velocityX = -4;
    
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    if(obstaclesGroup.isTouching(trex)){
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  
    spawnStars();
    spawnObstacles();
    
  } else if(gameState === END) {

    gameOver.x = camera.position.x;
    restart.x = camera.position.x;

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    starsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addImage(trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    starsGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  
  //console.log(localStorage["HighestScore"]);
  
  trex.collide(invisibleGround);
 
  drawSprites();
}

function spawnStars() {
  //write code here to spawn the clouds
  if (camera.position.x % 120 === 0) {
    var star = createSprite(camera.position.x + 300,120,40,10);
    star.y = Math.round(random(80,120));
    star.addImage(starImage);
    star.scale = 0.01;
    
     //assign lifetime to the variable
    star.lifetime = 200;
    
    //adjust the depth
    star.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    starsGroup.add(star);
  }
  
}

function spawnObstacles() {
  if(camera.position.x % 240 === 0) {
    var obstacle = createSprite(camera.position.x + 300,165,10,40);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  starsGroup.destroyEach();
  
  trex.addAnimation(trex_running);
  
  score = 0;
  
}