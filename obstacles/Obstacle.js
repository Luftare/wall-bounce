class Obstacle {
  constructor(position, scale = 1) {
    this.scale = scale;
    this.size = scale * CELL_SIZE;
    this.bounciness = 0.5;
    this.position = position.map(
      val => CELL_SIZE * (val + (1 - scale) / 2)
    );

    const element = document.createElement("div");
    element.classList = "obstacle";
    this.element = element;

    const borders = document.createElement("div");
    borders.classList = "obstacle-borders obstacle-borders--white";
    borders.style.left = `${this.position[0]}px`;
    borders.style.top = `${this.position[1]}px`;
    borders.style.width = `${this.size}px`;
    borders.style.height = `${this.size}px`;
    this.borders = borders;
    borders.appendChild(this.element);
    field.appendChild(borders);
  }

  openDialog() {
    this.borders.classList.add("center");
    game.finishLevel(this.linkIndex);
  }

  onCollision() {}
}
