class Princess extends Obstacle {
  constructor(position, linkIndex) {
    super(position, 0.7);
    this.linkIndex = linkIndex;
    this.size = CELL_SIZE * this.scale;
    this.element.classList.add("princess");
    this.element.style.position = "relative";
    this.element.style.backgroundImage = "url('assets/images/princess.svg')";
    this.element.style.zIndex = 20;
    this.borders.style.zIndex = 20;
    this.borders.classList.add("borders--blue");
  }

  onCollision() {
    if (game.obstacles.find(o => o instanceof Flower)) {
      game.hero.die();
    } else {
      this.borders.classList.add("center");
      game.finishLevel(this.linkIndex);
    }
  }
}
