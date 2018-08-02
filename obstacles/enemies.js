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
