class Hero {
  constructor(position) {
    this.maxPower = 0;
    this.power = this.maxPower;
    this.maxFitness = 3;
    this.fitness = this.maxFitness;
    this.scale = 0.7;
    this.size = this.scale * CELL_SIZE;
    this.speed = 7;
    this.maxStretch = 100;
    this.position = position.map(val => CELL_SIZE * (val + this.scale / 4));
    this.velocity = [0, 0];
    this.bounciness = 0.5;

    const borders = document.createElement("div");
    borders.classList = "obstacle-borders borders--yellow";
    const element = document.createElement("div");
    borders.style.width = `${this.size}px`;
    borders.style.height = `${this.size}px`;
    borders.style.left = `${this.position[0]}px`;
    borders.style.top = `${this.position[1]}px`;
    element.classList.add("hero");
    element.style.backgroundImage = "url('assets/images/hero.svg')";
    this.element = element;
    this.borders = borders;
    borders.appendChild(element);
    field.appendChild(borders);

    const arrow = document.createElement("div");
    arrow.classList = "hero__arrow";
    element.appendChild(arrow);
    this.arrow = arrow;
  }

  update(dt) {
    this.move(dt);
    this.handleCollisions(dt);
    this.handleFitness(dt);
    this.render(dt);
  }

  handleFitness() {
    if (magnitude(this.velocity) === 0 && this.fitness <= 0) {
      this.die();
    }
  }

  fight(target) {
    if (this.power < 0) return false;
    this.power--;
    if (this.power < 0) {
      //hero loses
      this.die();
      return false;
    } else {
      //hero wins
      this.element.classList.add("striking");
      game.timeFactor = 0.0;
      setTimeout(() => {
        this.element.classList.remove("striking");
        game.timeFactor = 1;
      }, 500);
      return true;
    }
  }

  openEndDialog(nextId) {
    this.borders.classList.add("center");
    game.finishLevel(nextId);
  }

  is(type) {
    return type === Hero;
  }

  die() {
    if (this.element.classList.contains("dead")) return;
    this.velocity = [0, 0];
    this.element.classList.add("dead");
    setTimeout(() => {
      game.loadLevel(game.levelId);
    }, 2500);
  }

  handleBoundaryCollisions(dt) {
    const bounds = [field.offsetWidth, field.offsetHeight];
    this.position.forEach((_, i) => {
      if (this.position[i] < 0) {
        if (i === 0 && game.edgeLinks[3])
          eval(game.storyScript);
        if (i === 1 && game.edgeLinks[0])
          eval(game.storyScript);
        this.position[i] = 0;
        this.velocity = this.velocity.map(
          (val, j) =>
            i === j ? Math.abs(val * this.bounciness) : val * this.bounciness
        );
      }
      if (this.position[i] + this.size > bounds[i]) {
        if (i === 0 && game.edgeLinks[1])
          eval(game.storyScript);
        if (i === 1 && game.edgeLinks[2])
          eval(game.storyScript);
        this.position[i] = bounds[i] - this.size;
        this.velocity = this.velocity.map(
          (val, j) =>
            i === j ? -Math.abs(val * this.bounciness) : val * this.bounciness
        );
      }
    });
  }

  handleObstacleCollisions(dt) {
    game.obstacles.forEach(obstacle => {
      const collision = getSquareCollisionSide(this, obstacle);
      if (collision) {
        obstacle.onCollision(dt);
        if (!obstacle.nonBlocking)
          this.bounceFromCollision(obstacle, collision);
      }
    });
  }

  bounceFromCollision(obstacle, collision) {
    switch (collision) {
      case "TOP":
        this.position[1] = obstacle.position[1] - this.size;
        this.velocity = this.velocity.map(
          (val, i) =>
            i === 1
              ? -Math.abs(val * obstacle.bounciness)
              : val * obstacle.bounciness
        );
        break;
      case "RIGHT":
        this.position[0] = obstacle.position[0] + obstacle.size;
        this.velocity = this.velocity.map(
          (val, i) =>
            i === 0
              ? Math.abs(val * obstacle.bounciness)
              : val * obstacle.bounciness
        );
        break;
      case "BOTTOM":
        this.position[1] = obstacle.position[1] + obstacle.size;
        this.velocity = this.velocity.map(
          (val, i) =>
            i === 1
              ? Math.abs(val * obstacle.bounciness)
              : val * obstacle.bounciness
        );
        break;
      case "LEFT":
        this.position[0] = obstacle.position[0] - this.size;
        this.velocity = this.velocity.map(
          (val, i) =>
            i === 0
              ? -Math.abs(val * obstacle.bounciness)
              : val * obstacle.bounciness
        );
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
    const velocityLength = Math.sqrt(
      this.velocity.reduce((acc, val) => acc + val ** 2, 0)
    );
    this.velocity = this.velocity.map(val => {
      if (velocityLength > 150) return val * (1 - 0.3 * dt);
      if (velocityLength > 50) return val * (1 - 0.7 * dt);
      return 0;
    });
    this.position = this.position.map((val, i) => val + this.velocity[i] * dt);
  }

  render() {
    mouseToHero = game.hero.position.map(
      (val, i) => val - mousePosition[i] + this.size / 2
    );
    const mouseToHeroLength = magnitude(mouseToHero);
    const { element, arrow } = this;
    const [heroX, heroY] = this.position;
    const arrowAngle = (-Math.atan2(...mouseToHero) * 180) / Math.PI;
    const moving = magnitude(this.velocity) > 0;
    this.borders.style.left = `${heroX}px`;
    this.borders.style.top = `${heroY}px`;
    this.arrow.style.height = `${Math.max(
      0,
      Math.min(this.maxStretch, mouseToHeroLength) / 300
    ) * 120}px`;
    this.arrow.style.transform = `translate(-50%, 0) rotate(${arrowAngle}deg) translateY(${this
      .size * 0.7}px)`;

    this.arrow.classList[moving ? "add" : "remove"]("hero__arrow--hidden");
    if (!game.paused) element.classList[moving ? "add" : "remove"]("run");

    statusPower.innerHTML = `${this.power} Power`;
    statusFitness.innerHTML = `${this.fitness} Fitness`;
  }
}
