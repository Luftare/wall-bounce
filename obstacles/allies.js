class Princess extends Obstacle {
  constructor(position, linkIndex) {
    super(position);
    this.linkIndex = linkIndex;
    this.position = this.position.map(val => val + 0.15 * CELL_SIZE);
    this.element.style.left = `${this.position[0]}px`;
    this.element.style.top = `${this.position[1]}px`;
    this.size = CELL_SIZE * 0.7;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;
    this.element.classList.add('princess');
    this.element.style.backgroundImage = "url('https://data.whicdn.com/images/80478767/large.png')";
    this.element.style.zIndex = 20;
  }

  onCollision() {
    if(game.obstacles.find(o => o instanceof Flower)) {
      game.hero.die();
    } else {
      this.element.classList.add('center');
      game.finishLevel(this.linkIndex);
    }
  }
}
