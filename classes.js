class Loop {
  constructor(cb) {
    this.then = null;
    this.running = false;
    this.onTick = cb;
  }

  tick() {
    const now = Date.now();
    const dt = now - this.then;
    this.then = now;
    this.onTick(dt / 1000);
    requestAnimationFrame(this.tick.bind(this));
  }

  start() {
    this.running = true;
    this.then = Date.now() - 16;
    this.tick();
  }
}

class Obstacle {
  constructor(position, size) {
    this.position = [...position];
    this.size = size;

    const element = document.createElement('div');
    element.style.width = `${this.size}px`;
    element.style.height = `${this.size}px`;
    element.style.left = `${this.position[0]}px`;
    element.style.top = `${this.position[1]}px`;
    element.classList = 'obstacle';
    this.element = element;
    field.appendChild(element);
  }

  onCollision() {}
}

class Tree extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.classList.add('tree');
  }
}

class Orc extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.classList.add('orc');
    this.hp = 1;
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.element.classList.add('dead');
  }
}

class Hero {
  constructor(size) {
    this.size = size;
    this.speed = 5;
    this.maxStretch = 100;
    this.position = [0, 0];
    this.velocity = [90, 30];
    this.bounciness = 0.5;

    const element = document.createElement('div');
    element.style.width = `${this.size}px`;
    element.style.height = `${this.size}px`;
    element.style.left = `${this.position[0]}px`;
    element.style.top = `${this.position[1]}px`;
    element.classList = 'hero';
    this.element = element;
    field.appendChild(element);

    const arrow = document.createElement('div');
    arrow.classList = 'hero__arrow';
    element.appendChild(arrow);
    this.arrow = arrow;
  }

  update(dt) {
    const velocityLength = Math.sqrt(this.velocity.reduce((acc, val) => acc + val ** 2, 0));
    this.velocity = this.velocity.map((val) => {
      if(velocityLength > 150) return val * 0.997;
      if(velocityLength > 10) return val * 0.97;
      return 0;
    });
    this.move(dt);
    this.handleCollisions();
    this.render();
  }

  handleBoundaryCollisions(dt) {
    const bounds = [field.offsetWidth, field.offsetHeight];
    this.position.forEach((_, i) => {
      if(this.position[i] < 0) {
        this.position[i] = 0;
        this.velocity = this.velocity.map((val, j) => i === j? Math.abs(val * this.bounciness) : val * this.bounciness);
      }
      if(this.position[i] + this.size > bounds[i]) {
        this.position[i] = bounds[i] - this.size;
        this.velocity = this.velocity.map((val, j) => i === j? -Math.abs(val * this.bounciness) : val * this.bounciness);
      }
    });
  }

  handleObstacleCollisions(dt) {
    game.obstacles.forEach(obstacle => {
      const collision = getSquareCollisionSide(this, obstacle);
      if(collision) {
        obstacle.onCollision();
        switch (collision) {
          case 'TOP':
            this.position[1] = obstacle.position[1] - this.size;
            this.velocity = this.velocity.map((val, i) => i === 1? -Math.abs(val * this.bounciness) : val * this.bounciness);
            break;
          case 'RIGHT':
            this.position[0] = obstacle.position[0] + obstacle.size;
            this.velocity = this.velocity.map((val, i) => i === 0? Math.abs(val * this.bounciness) : val * this.bounciness);
            break;
          case 'BOTTOM':
            this.position[1] = obstacle.position[1] + obstacle.size;
            this.velocity = this.velocity.map((val, i) => i === 1? Math.abs(val * this.bounciness) : val * this.bounciness);
            break;
          case 'LEFT':
            this.position[0] = obstacle.position[0] - this.size;
            this.velocity = this.velocity.map((val, i) => i === 0? -Math.abs(val * this.bounciness) : val * this.bounciness);
            break;
          default:

        }
      }
    });
  }

  handleCollisions(dt) {
    this.handleBoundaryCollisions(dt);
    this.handleObstacleCollisions(dt);
  }

  move(dt) {
    this.position = this.position.map((val, i) => val + this.velocity[i] * dt);
  }

  render() {
    mouseToHero = game.hero.position.map(((val, i) => val - mousePosition[i] + this.size / 2));
    const mouseToHeroLength = magnitude(mouseToHero);
    const { element, arrow } = this;
    const [heroX, heroY] = this.position;
    const arrowAngle = -Math.atan2(...mouseToHero) * 180 / Math.PI;
    element.style.left = `${heroX}px`;
    element.style.top = `${heroY}px`;
    this.arrow.style.height = `${Math.max(0, Math.min(this.maxStretch, mouseToHeroLength) / 200) * 120}px`;
    this.arrow.style.transform = `translate(-50%, 0) rotate(${arrowAngle}deg) translateY(${this.size * 0.3}px)`;
  }
}

class Game {
  constructor() {
    this.gridSize = 12;
    this.hero = new Hero(0.7 * field.offsetWidth / this.gridSize);
    this.loop = new Loop((dt) => {
      this.hero.update(dt);
    });
    this.obstacles = [...Array(12)].map(() => {
      const Type = Math.random() > 0.5 ? Orc : Tree;
      const position = [
        field.offsetWidth * Math.floor(Math.random() * this.gridSize) / this.gridSize,
        field.offsetHeight * Math.floor(Math.random() * this.gridSize) / this.gridSize
      ];
      return new Type(position, field.offsetWidth / this.gridSize);
    });
  }

  start() {
    this.loop.start();
  }
}
