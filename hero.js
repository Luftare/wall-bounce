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
