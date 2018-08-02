class Flower extends Obstacle {
  constructor(...props) {
    super(...props);
    this.nonBlocking = true;
    this.element.style.backgroundImage = "url('http://pixelartmaker.com/art/c3e11013976b1c8.png')";
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.element.classList.add('picked-up');
  }
}
