class Tree extends Obstacle {
  constructor(conf) {
    super(conf.position);
    this.bounciness = 0.3;
    this.element.style.backgroundColor = "rgba(100, 105, 0, 1)";
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE] || 'tree'}.svg')`;
  }
}

class Sprite extends Obstacle {
  constructor(conf) {
    super(conf.position);
    this.nonBlocking = true;
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE]}.svg')`;
    this.hovering = !!conf.hovering;
    if(conf.hovering) this.borders.classList.add('hovering');
  }
}

class Wall extends Obstacle {
  constructor(conf) {
    super(conf.position);
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE] || 'wall'}.svg')`;
  }
}

class Wind extends Obstacle {
  constructor(conf) {
    super(conf.position);
    this.direction = conf.direction;
    this.force = 1000;
    this.nonBlocking = true;
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE] || 'wind'}.svg')`;
    this.element.classList.add('wind');
    this.element.classList.add(`wind--${conf.direction.toLowerCase()}`);
    this.element.style.animationDelay = `${Math.random() * 700}ms`;
    this.borders.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  }

  onCollision(dt) {
    if(magnitude(game.hero.velocity) < 10) return;
    switch (this.direction) {
      case UP:
        game.hero.velocity[1] -= this.force * dt;
        break;
      case DOWN:
        game.hero.velocity[1] += this.force * dt;
        break;
      case LEFT:
        game.hero.velocity[0] -= this.force * dt;
        break;
      case RIGHT:
        game.hero.velocity[0] += this.force * dt;
        break;
    }
  }
}
