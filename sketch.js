var PLAY = 1;
var END = 0;
var gameState = "play";

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound, checkPointSound, dieSound;
var treoImg, trexDown;
var teroGroup;
var hora=1;

var arena;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
 
  arena = loadImage("icons8-tornado-50.png");
  casco = loadImage("icons8-football-helmet-32.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  casco = createSprite(50,windowWidth-20,20,50);
  casco.addImage(cascoImage);
  casco.scale = 0.5;
  casco.depth = trex.depth;
  casco.depth = trex.depth + 1;


  trex = createSprite(50,windowHeight-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
 
  trex.scale = 0.5;

  ground = createSprite(200,windowHeight-20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  invisibleGround = createSprite(200,windowHeight-10,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  arenaGroup = createGroup();
  
  console.log("Hola" + 5);

  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  restart= createSprite(windowWidth/2,windowHeight/2+40);
  restart.addImage(restartImg);
  restart.scale =0.5
  gameOver.scale =0.5
  gameOver.visible = false;
  restart.visible= false;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);
  score = 0;
}

function draw() {
  
  if(hora === 1){
    background(180);
  }
  else{
    background("black");
  }
  
  text("Puntuación: "+ score, windowWidth-100,50);
  
  if(gameState === "play"){
    if(score%800===0 && score>0){
      hora *=-1;
    }

    if(score%100 === 0 && score>0){
      checkPointSound.play();
    }

    trex.visible= true;   
    ground.velocityX = -4;
   
    score = score + 1;

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if((keyDown("space") || touches.lenght>0) && trex.y >= windowHeight-70) {
        trex.velocityY = -13;
        jumpSound.play();
        touches= [];
    }

    trex.velocityY = trex.velocityY + 0.8
  
  
    spawnClouds();
    spawnObstacles();
    spawnArena();
   
    if(trex.isTouching(obstaclesGroup)){
      gameState = "end";
      trex.velocityY = 0
    }
    if(trex.isTouching(arenaGroup)){
      invisibleGround.x=-600;
      trex.velocityY = 6
      gameState = "end";
    }
    
    
  }
   else if (gameState === "end") {
  
      trex.changeAnimation("collided", trex_collided)
      ground.velocityX = 0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      arenaGroup.setVelocityXEach(0);
      gameOver.visible = true;
      restart.visible = true;
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      
      if(mousePressedOver(restart) || touches.length>0){
        reset();
        touches =[];
      }
   }
  trex.collide(invisibleGround); 
  drawSprites();
}

function reset(){
  score = 0;
  gameState = "play";
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  arenaGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);
  invisibleGround.x= 200;
  trex.y= windowHeight-20;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth-100,windowHeight-35,10,40);
   obstacle.velocityX = -6;
   
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
   
    obstacle.scale = 0.5;
    obstacle.lifetime = 600;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
   if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(10,windowHeight-40));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime =600;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
   cloudsGroup.add(cloud);
    }
}


function spawnArena() {
  if (frameCount % 150 === 0) {
    arena = createSprite(windowWidth,windowHeight-15,40,10);
    //arena.debug = true
    arena.setCollider("rectangle", 20,0, 40,10);
    arena.velocityX = -6;
    arena.lifetime =600;
    arenaGroup.add(arena);
    arena.addImage(arena);
    arena.scale = 0.9;
   }
}

