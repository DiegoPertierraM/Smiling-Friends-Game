window.addEventListener('load', function () {
  const canvas = document.querySelector('#canvas1') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    game;
    constructor(game: Game) {
      this.game = game;
      window.addEventListener('keydown', (e) => {
        if (
          (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
        console.log(this.game.keys);
      });

      window.addEventListener('keyup', (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
        console.log(this.game.keys);
      });
    }
  }

  class Projectile {}

  class Particle {}

  class Player {
    width;
    height;
    x;
    y;
    speedX;
    maxSpeed;
    image;
    constructor(public game: Game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedX = 0;
      this.maxSpeed = 4;
      this.image = document.querySelector('#player') as CanvasImageSource;
    }

    update() {
      if (this.game.keys.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowRight'))
        this.speedX = this.maxSpeed;
      else this.speedX = 0;
      this.x += this.speedX;
    }

    draw(context: CanvasRenderingContext2D) {
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  class Enemy {
    game;
    x!: number;
    y!: number;
    width;
    height;
    speedX;
    markedForDeletion;

    constructor(game: Game, width: number, height: number) {
      this.game = game;
      this.width = width;
      this.height = height;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
    }

    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context: CanvasRenderingContext2D) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Enemy1 extends Enemy {
    constructor(game: Game) {
      super(game, 50, 50);
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }

  class Layer {}

  class Background {}

  class UI {
    game;
    fontSize;
    fontFamily;
    color;
    constructor(game: Game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'white';
    }

    draw(context: CanvasRenderingContext2D) {
      context.fillStyle = this.color;
    }
  }

  class Game {
    player;
    input;
    ui;
    keys: string[];
    enemies: Enemy[];
    enemyTimer;
    enemyInterval;
    gameOver;
    constructor(public width: number, public height: number) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.gameOver = false;
    }

    update(deltaTime: number) {
      this.player.update();
      this.enemies.forEach((enemy: Enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }

    draw(context: CanvasRenderingContext2D) {
      this.player.draw(context);
      this.enemies.forEach((enemy: Enemy) => {
        enemy.draw(context);
      });
    }

    addEnemy() {
      this.enemies.push(new Enemy1(this));
      console.log(this.enemies);
    }

    checkCollision(rect1: Player, rect2: Enemy) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp: number) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});
