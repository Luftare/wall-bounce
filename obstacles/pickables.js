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
