function sprite(options) {
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    tickPerFrame = options.tickPerFrame || 0,
    numberOfFrame = options.numberOfFrame || 1;

  that.context = options.context;
  that.w = options.w;
  that.h = options.h;
  that.img = options.img;
  that.x = options.x;
  that.y = options.y;
  that.scaleRatio = 1;

  that.update = function () {
    tickCount += 1;

    if (tickCount > tickPerFrame) {
      tickCount = 0;

      if (frameIndex < numberOfFrame - 1) {
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  };

  that.render = function () {
    that.context.drawImage(
      that.img,
      (frameIndex * that.w) / numberOfFrame,
      0,
      that.w / numberOfFrame,
      that.h,
      that.x,
      that.y,
      that.w / numberOfFrame,
      that.h
    );
  };

  return that;
}

//init var
var knight,
  knightImage,
  canvas,
  score = 0,
  zombieMale = [],
  numZombieMale = 5,
  life = 3,
  restart = document.getElementById("restart");

canvas = document.getElementById("cnv");
canvas.width = 1024;
canvas.height = 480;

for (var i = 1; i <= numZombieMale; i++) {
  spawnZombieMale();
}

knightImage = new Image();

knight = sprite({
  context: canvas.getContext("2d"),
  w: 1740,
  h: 210,
  img: knightImage,
  numberOfFrame: 10,
  tickPerFrame: 10,
  x: 0,
  y: canvas.height - 203,
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function spawnZombieMale() {
  var zombieMaleIndex, zombieMaleImage;

  zombieMaleImage = new Image();
  zombieMaleIndex = zombieMale.length;

  //create sprite
  zombieMale[zombieMaleIndex] = sprite({
    context: canvas.getContext("2d"),
    w: 1740,
    h: 210,
    img: zombieMaleImage,
    numberOfFrame: 10,
    tickPerFrame: 10,
  });

  zombieMaleImage.src = "images/character/zombiemale.png";

  zombieMale[zombieMaleIndex].x = canvas.width + getRandomInt(100, 700); // * (canvas.width - zombieMale[zombieMaleIndex] * zombieMale[zombieMaleIndex].scaleRatio) ;
  zombieMale[zombieMaleIndex].y = canvas.height - 210;
  zombieMale[zombieMaleIndex].scaleRatio = Math.random() * 0.5 + 0.5;
}


console.log(zombieMale);
knightImage.src = "images/character/knight.png";
game = gameLoop();

// game
function gameLoop() {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  if (life > 0) {
    requestAnimationFrame(gameLoop);
  } else if (life < 1) {
    drawGameOver();
    stop_the_game();
  } 

  if (score >= 10) {
    drawTextWin();
  }
    
  drawText();
  drawTextLife();


  for (var i = 0; i < zombieMale.length; i++) {
    zombieMale[i].update();
    //if score berapa, nambah kecepatan
    if (score <= 4) {
      zombieMale[i].x -= 3;
    } else if (score <= 7 && score > 4) {
      zombieMale[i].x -= 3.5;
    } else {
      zombieMale[i].x -= 4;
    }
    
    zombieMale[i].render();
    // respawn jika keluar canvas
    if (zombieMale[i].x < -128) {
      destroyZombieMale(zombieMale[i]);
      setTimeout(spawnZombieMale, 1000);
      life -= 1;
    }
  }
  if (knight.x < 0) {
    knight.x = 0;
  }
  if (knight.x > canvas.width - 174) {
    knight.x = canvas.width - 174;
  }

  knight.update();
  knight.render();
}

document.addEventListener("keydown", keydown);

function keydown(e) {
  switch (e.keyCode) {
    case 37:
      knight.x -= 40;
      break;
    case 39:
      knight.x += 40;
      break;
    case 32:
      for (var i = 0; i < zombieMale.length; i++) {
        if (
          zombieMale[i].x > knight.x + 50 &&
          zombieMale[i].x < knight.x + 125
        ) {
          destroyZombieMale(zombieMale[i]);
          setTimeout(spawnZombieMale, 800);
          score++;
        }
      }

      break;
  }
}

document.getElementById('gameScreen').addEventListener('touchstart', f)

function f(ev) {
  for (var i = 0; i < zombieMale.length; i++) {
    if (
      zombieMale[i].x > knight.x + 50 &&
      zombieMale[i].x < knight.x + 125
    ) {
      destroyZombieMale(zombieMale[i]);
      setTimeout(spawnZombieMale, 800);
      score++;
    }
  }
}

function walkLeft() {
  knight.x -= 20;
}

function walkRight() {
  knight.x += 20;
}

function hit() {
  for (var i = 0; i < zombieMale.length; i++) {
    if (
      zombieMale[i].x > knight.x + 50 &&
      zombieMale[i].x < knight.x + 125
    ) {
      destroyZombieMale(zombieMale[i]);
      setTimeout(spawnZombieMale, 800);
      score++;
    }
  }
}

function drawText() {
  var context = canvas.getContext("2d");
  context.font = "bold 20px Consolas";
  context.textAlign = "start";
  context.fillStyle = "white";
  context.fillText("Score: " + score, 874, 40);
}

function drawTextLife() {
  var context = canvas.getContext("2d");
  context.font = "bold 20px Consolas";
  context.textAlign = "start";
  context.fillStyle = "white";
  context.fillText("Lives: " + life, 724, 40);
}

function drawGameOver() {
  var context = canvas.getContext("2d");
  context.font = "bold 120px Poppins";
  context.textAlign = "start";
  context.fillStyle = "white";
  context.fillText("Game Over", 220, 250);
}

function drawTextWin() {
  var context = canvas.getContext("2d");
  context.font = "bold 20px Consolas";
  context.textAlign = "start";
  context.fillStyle = "white";
  context.fillText("You Win! You have defeated " + score + " zombies.", 30, 40);
}

function destroyZombieMale(param) {
  for (var i = 0; i < zombieMale.length; i++) {
    if (zombieMale[i] == param) {
      zombieMale[i] = null;
      zombieMale.splice(i, 1);
      break;
    }
  }
}

function stop_the_game() {
  cancelAnimationFrame(gameLoop);
  document.getElementById("restart").style.display = "inline";
}

