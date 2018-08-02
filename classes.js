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
  constructor(position) {
    this.position = position.map(val => CELL_SIZE * val);
    this.size = CELL_SIZE;
    this.bounciness = 0.5;

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

class Princess extends Obstacle {
  constructor(...props) {
    super(...props);
    this.position = this.position.map(val => val + 0.15 * CELL_SIZE);
    this.element.style.left = `${this.position[0]}px`;
    this.element.style.top = `${this.position[1]}px`;
    this.size = CELL_SIZE * 0.7;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.classList.add('princess');
  }

  onCollision() {
    if(game.obstacles.find(o => o instanceof Flower)) {
      game.hero.die();
    } else {
      game.finishLevel();
    }
  }
}

class Tree extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.3;
    this.element.classList.add('tree');
  }
}

class Flower extends Obstacle {
  constructor(...props) {
    super(...props);
    this.nonBlocking = true;
    this.element.classList.add('flower');
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.element.classList.add('picked-up');
  }
}

class Wall extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.classList.add('wall');
  }
}

class Orc extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.9;
    this.element.classList.add('orc');
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.element.classList.add('dead');
    game.timeFactor = 0.2;
    game.hero.fight(this);

    setTimeout(() => {
      game.timeFactor = 1;
    }, 200);
  }
}

class Hero {
  constructor(position) {
    this.maxPower = 1;
    this.power = this.maxPower;
    this.maxFitness = 3;
    this.fitness = this.maxFitness;
    this.size = 0.7 * CELL_SIZE;
    this.speed = 5;
    this.maxStretch = 100;
    this.position = position.map(val => CELL_SIZE * (val + 0.15));
    this.velocity = [0, 0];
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
    this.move(dt);
    this.handleCollisions();
    this.handleFitness();
    this.render();
  }

  handleFitness() {
    if(magnitude(this.velocity) === 0 && this.fitness <= 0) {
      this.die();
    }
  }

  fight(target) {
    if(this.power < 0) return;
    this.power--;
    if(this.power < 0) {
      this.die();
    };
  }

  die() {
    if(this.element.classList.contains('dead')) return;
    this.velocity = [0, 0];
    this.element.classList.add('dead');
    setTimeout(() => {
      game.loadLevel(game.level);
    }, 3000);
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
        if(!obstacle.nonBlocking) this.bounceFromCollision(obstacle, collision);
      }
    });
  }

  bounceFromCollision(obstacle, collision) {
    switch (collision) {
      case 'TOP':
        this.position[1] = obstacle.position[1] - this.size;
        this.velocity = this.velocity.map((val, i) => i === 1? -Math.abs(val * obstacle.bounciness) : val * obstacle.bounciness);
        break;
      case 'RIGHT':
        this.position[0] = obstacle.position[0] + obstacle.size;
        this.velocity = this.velocity.map((val, i) => i === 0? Math.abs(val * obstacle.bounciness) : val * obstacle.bounciness);
        break;
      case 'BOTTOM':
        this.position[1] = obstacle.position[1] + obstacle.size;
        this.velocity = this.velocity.map((val, i) => i === 1? Math.abs(val * obstacle.bounciness) : val * obstacle.bounciness);
        break;
      case 'LEFT':
        this.position[0] = obstacle.position[0] - this.size;
        this.velocity = this.velocity.map((val, i) => i === 0? -Math.abs(val * obstacle.bounciness) : val * obstacle.bounciness);
        break;
      default:
    }
  }

  handleCollisions(dt) {
    this.handleBoundaryCollisions(dt);
    this.handleObstacleCollisions(dt);
  }

  charge(velocity) {
    this.fitness--;
    this.velocity = velocity;
  }

  move(dt) {
    const velocityLength = Math.sqrt(this.velocity.reduce((acc, val) => acc + val ** 2, 0));
    this.velocity = this.velocity.map((val) => {
      if(velocityLength > 150) return val * 0.997;
      if(velocityLength > 10) return val * 0.97;
      return 0;
    });
    this.position = this.position.map((val, i) => val + this.velocity[i] * dt);
  }

  render() {
    mouseToHero = game.hero.position.map(((val, i) => val - mousePosition[i] + this.size / 2));
    const mouseToHeroLength = magnitude(mouseToHero);
    const { element, arrow } = this;
    const [heroX, heroY] = this.position;
    const arrowAngle = -Math.atan2(...mouseToHero) * 180 / Math.PI;
    const moving = magnitude(this.velocity) > 0;
    element.style.left = `${heroX}px`;
    element.style.top = `${heroY}px`;
    this.arrow.style.height = `${Math.max(0, Math.min(this.maxStretch, mouseToHeroLength) / 200) * 120}px`;
    this.arrow.style.transform = `translate(-50%, 0) rotate(${arrowAngle}deg) translateY(${this.size * 0.7}px)`;

    this.arrow.classList[moving ? 'add' : 'remove']('hero__arrow--hidden');
    if(!game.paused) element.classList[moving ? 'add' : 'remove']('run');

    statusPower.innerHTML = `${this.power} Power`;
    statusFitness.innerHTML = `${this.fitness} Fitness`;
  }
}

class Game {
  constructor() {
    this.level = 0;
    this.timeFactor = 1;
    this.paused = true;
    this.loop = new Loop((dt) => {
      if(this.paused) return;
      this.hero.update(dt * this.timeFactor);
    });
    this.loadLevel(this.level);
  }

  loadLevel(index) {
    const level = levels[index];
    this.paused = false;
    this.level = index;
    field.innerHTML = '';
    this.smokeScreen = document.createElement('div');
    this.smokeScreen.classList.add('smoke-screen');
    field.appendChild(this.smokeScreen);
    field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
    this.hero = new Hero(level.hero);
    this.obstacles = [
      ...level.obstacles.map(o => {
        switch (o.type) {
          case 'orc':
            return new Orc(o.position);
            break;
          case 'tree':
            return new Tree(o.position);
            break;
          case 'wall':
            return new Wall(o.position);
            break;
          case 'flower':
            return new Flower(o.position);
            break;
        }
      }),
      new Princess(level.princess)
    ];
  }

  finishLevel() {
    this.paused = true;
    const pricess = this.obstacles.find(obstacle => obstacle instanceof Princess);
    pricess.element.classList.add('center-left');
    this.hero.element.classList.remove('run');
    this.hero.element.classList.add('center-right');
    this.smokeScreen.classList.add('smoke-screen--visible')
    setTimeout(() => {
      router.goTo(`/level/${this.level + 1}`);
    }, 3000);
  }

  start() {
    this.loop.start();
  }
}
