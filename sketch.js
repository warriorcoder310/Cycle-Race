var path, mainCyclist;
var pathImg, mainRacerImg1, mainRacerImg2, obstacle, obstacle1, obstacle2, obstacle3, obstaclegroup, coin, coinimg, coinGroup, diamond, diamondimg, diamondGroup;
var cycleBell, pinkCG, yellowCG, redCG, edges;
var distance, selectnumber, selectobstacle;
var player1, player2, player3, player1img, player2img, player3img;
var pinkcollided, yellowcollided, redcollided, pinkcollidedimg, yellowcollidedimg, redcollidedimg;
var gameover, gameoverimg, reset, resetimg;
var menu, menuimg;
var message1 = "Beat your opponent cyclists.";
var message2 = "Avoid the obstacles.";
var message3 = "Collect the coins and gems.";
//var message4 = "Beat a cyclist to get a surprise powerup.";
var message4 = " ";
//var message5 = "Use a powerup by clicking on it on your screen."
var message5 = " ";
var message6 = "Press space to ring your cycle's bell. Have fun!";
var restartmessage = "Press 'r' to restart!";
var value = 1;
var END = 0;
var PLAY = 1;
var gameState = PLAY;
var distance = 0;
var score = 0;

function preload() {
  pathImg = loadImage("images/Road.png");
  mainRacerImg1 = loadAnimation("images/mainPlayer1.png", "images/mainPlayer2.png");
  mainRacerImg2 = loadAnimation("images/mainPlayer3.png");
  cycleBell = loadSound("sound/bell.mp3");
  player1img = loadAnimation("opponent1.png");
  player2img = loadAnimation("opponent4.png");
  player3img = loadAnimation("opponent7.png");
  pinkcollidedimg = loadAnimation("opponent3.png");
  yellowcollidedimg = loadAnimation("opponent6.png")
  redcollidedimg = loadAnimation("opponent9.png");
  gameoverimg = loadImage("gameOver.png");
  resetimg = loadImage("reset.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  menuimg = loadImage("menu.png");
  coinimg = loadImage("coin.png");
  diamondimg = loadImage("diamond.png");
}

function setup() {
  createCanvas(500, 300);

  // Moving background
  path = createSprite(100, 150);
  path.addImage(pathImg);
  //path.velocityX = -20;

  //creating boy running
  mainCyclist = createSprite(200, 150, 20, 20);
  mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
  mainCyclist.addAnimation("SahilCollided", mainRacerImg2);
  mainCyclist.scale = 0.07;
  
  path.depth = mainCyclist.depth - 20;
  
  gameover = createSprite(250, 130, 10, 10);
  gameover.addImage(gameoverimg);
  gameover.scale = 0.75;
  
  reset = createSprite(250, 202, 10, 10);
  reset.addImage(resetimg);
  reset.scale = 0.1;
  
  menu = createSprite(475, 290, 10, 10);
  menu.addImage(menuimg);

  value = 1;
  
  pinkCG = new Group();
  yellowCG = new Group();
  redCG = new Group();
  obstaclegroup = new Group();
  coinGroup = new Group();
  diamondGroup = new Group();
}

function draw() {
  background(0);

  drawSprites();
  textSize(20);
  fill("white");
  strokeWeight = 2;
  stroke("white");
  
  text("Distance: " + distance, 350, 30);
  text("Score: " + score, 20, 30);
  
  fill("red");
  stroke("white");
  text(message1, 40, 204);
  text(message2, 40, 221);
  text(message3, 40, 238);
  text(message4, 40, 255);
  text(message5, 40, 272);
  text(message6, 40, 289);
  
  mainCyclist.setCollider("rectangle", 0, 0, mainCyclist.width-100, mainCyclist.height-100);
  
    edges = createEdgeSprites();
    mainCyclist.collide(edges);


  if (gameState === PLAY) {

    mainCyclist.y = World.mouseY;

    distance = distance + Math.round(getFrameRate() / 60);
    
    path.velocityX = -(6 + 2*distance/150);
    
    gameover.visible = false;
    reset.visible = false;

    //code to reset the background
    if (path.x < 0) {
      path.x = width / 2;
    }

    if (keyDown("space")) {
      cycleBell.play();
    }
  
    
    if (mousePressedOver(menu)) {
      if (value === 1) {
    message1 = " ";
    message2 = " ";
    message3 = " ";
    message4 = " ";
    message5 = " ";
    message6 = " ";
    value = 0;
      } else if (value === 0) {
      message1 = "Beat your opponent cyclists.";
      message2 = "Avoid the obstacles.";
      message3 = "Collect the coins and gems.";
      //message4 = "Beat a cyclist to get a surprise powerup.";
      //message5 = "Use a powerup by clicking on it on your screen."
      message4 = " ";
      message5 = " ";
      message6 = "Press space to ring your cycle's bell. Have fun!"  
      value = 1;
      }

    }
    
    spawncoins();
    spawndiamonds();
    
    if (coinGroup.isTouching(mainCyclist)) {
      score = score + 1;
      coinGroup.destroyEach();
    }
    
    if (diamondGroup.isTouching(mainCyclist)) {
      score = score + 15;
      diamondGroup.destroyEach();
    }

    if (frameCount % 210 === 0) {
      selectnumber = Math.round(random(1, 3));
      
      if (selectnumber === 1) {
        spawnpinkbikers();
      } else if (selectnumber === 2) {
        spawnyellowbikers();
      } else if (selectnumber === 3) {
        spawnredbikers();
      }
    }
    
    spawnobstacles();
    
    if (obstaclegroup.isTouching(mainCyclist)) {
      gameState = END;
    }
    
    if(pinkCG.isTouching(mainCyclist)){
     gameState = END;
     player1.velocityY = 0;
     player1.addAnimation("opponentPlayer1",pinkcollidedimg);
     pinkCG.setVelocityXEach(0);
     pinkCG.setLifetimeEach(-1);
    }
    
    if(yellowCG.isTouching(mainCyclist)){
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2",yellowcollidedimg);
      yellowCG.setVelocityXEach(0);
      yellowCG.setLifetimeEach(-1);
    }
    
    if(redCG.isTouching(mainCyclist)){
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3",redcollidedimg);
      redCG.setVelocityXEach(0);
      redCG.setLifetimeEach(-1);
    }

  } else if (gameState === END) {
    
    message1 = " ";
    message2 = " ";
    message3 = " ";
    message4 = " ";
    message5 = " ";
    message6 = " ";
    value = 0;
    
    obstaclegroup.setVelocityXEach(0);
    obstaclegroup.setLifetimeEach(-1);
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    diamondGroup.setVelocityXEach(0);
    diamondGroup.setLifetimeEach(-1);
    
    path.velocityX = 0;
    mainCyclist.changeAnimation("SahilCollided", mainRacerImg2);
    fill("skyblue");
    stroke("skyblue");
    text(restartmessage, gameover.x-80, gameover.y + 42);
    gameover.visible = true;
    reset.visible = true;
    
    if (mousePressedOver(reset)||keyDown("r")) {
      resetgame();
    }

}
}

function spawnpinkbikers() {
  player1 = createSprite(500, Math.round(random(50, 250)), 10, 10);
  player1.addAnimation("opponentPlayer1", player1img);
  player1.scale = 0.06;
  player1.lifetime = 800;
  player1.velocityX = -(3 + 2*distance/150);
  player1.depth = mainCyclist.depth - 3;
  pinkCG.add(player1);
}

function spawnyellowbikers() {
  player2 = createSprite(500, Math.round(random(50, 250)), 10, 10);
  player2.addAnimation("opponentPlayer2", player2img);
  player2.scale = 0.06;
  player2.lifetime = 800;
  player2.velocityX = -(3 + 2*distance/150);
  player2.depth = mainCyclist.depth - 3;
  yellowCG.add(player2);
}

function spawnredbikers() {
  player3 = createSprite(500, Math.round(random(50, 250)), 10, 10);
  player3.addAnimation("opponentPlayer3", player3img);
  player3.scale = 0.06;
  player3.lifetime = 800;
  player3.velocityX = -(3 + 2*distance/150);
  player3.depth = mainCyclist.depth - 3;
  redCG.add(player3);
}

function resetgame() {
  gameState = PLAY;
  mainCyclist.changeAnimation("SahilRunning", mainRacerImg1);
  pinkCG.destroyEach();
  yellowCG.destroyEach();
  redCG.destroyEach();
  obstaclegroup.destroyEach();
  coinGroup.destroyEach();
  diamondGroup.destroyEach();
  distance = 0;
  score = 0;
}

function spawnobstacles() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(500, Math.round(random(50, 250)), 10, 10);
    selectobstacle = Math.round(random(1, 3));
    if (selectobstacle === 1) {
      obstacle.addImage(obstacle1);
      obstacle.scale = 0.1;
    }  else if (selectobstacle === 2) {
      obstacle.addImage(obstacle2);
      obstacle.scale = 0.1;
    }  else if (selectobstacle === 3) {
      obstacle.addImage(obstacle3);
      obstacle.scale = 0.1;
    }
    obstacle.lifetime = 200;
    obstacle.depth = mainCyclist.depth - 4;
    obstacle.velocityX = -(7 + 2*distance/150);
    obstaclegroup.add(obstacle);
  }
}

function spawncoins() {
  if (frameCount % 150 === 0) {
    coin = createSprite(500, Math.round(random(50, 250)), 10, 10);
    coin.addImage(coinimg);
    coin.scale = 0.2;
    coin.depth = mainCyclist.depth - 2;
    coin.lifetime = 400;
    coin.velocityX = -(8 + 2*distance/150);
    coinGroup.add(coin);
  }
}

function spawndiamonds() {
  if (frameCount % 900 === 0) {
    diamond = createSprite(500, Math.round(random(50, 250)), 10, 10);
    diamond.addImage(diamondimg);
    diamond.scale = 0.1;
    diamond.depth = mainCyclist.depth - 1;
    diamond.lifetime = 400;
    diamond.velocityX = -(16 + 2*distance/150);
    diamondGroup.add(diamond);
  }
}