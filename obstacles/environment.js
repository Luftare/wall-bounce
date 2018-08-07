class Tree extends Obstacle {
  constructor({position}) {
    super(position);
    this.bounciness = 0.3;
    this.element.style.backgroundColor = "rgba(100, 105, 0, 1)";
    this.element.style.backgroundImage = "url('assets/images/tree.svg')";
  }
}

class Wall extends Obstacle {
  constructor({position}) {
    super(position);
    this.element.style.backgroundImage = "url('assets/images/wall.svg')";
  }
}

class Wind extends Obstacle {
  constructor({position, direction}) {
    super(position);
    this.direction = direction;
    this.force = 1000;
    this.nonBlocking = true;
    this.element.style.backgroundImage = "url('assets/images/wind.svg')";
    this.element.classList.add('wind');
    this.element.classList.add(`wind--${direction.toLowerCase()}`);
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
