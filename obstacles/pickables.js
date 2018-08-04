class Flower extends Obstacle {
  constructor(...props) {
    super(...props);
    this.nonBlocking = true;
    this.element.style.backgroundImage = "url('assets/images/flower.svg')";
    // this.element.style.backgroundColor = "rgba(100, 100, 0, 0.7)";
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.borders.classList.add("picked-up");
    game.hero.element.classList.add("picking-up");
    game.timeFactor = 0;
    setTimeout(() => {
      game.timeFactor = 1;
      game.hero.element.classList.remove("picking-up");
    }, 500);
  }
}
