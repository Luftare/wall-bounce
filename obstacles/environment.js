class Tree extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.3;
    this.element.style.backgroundColor = "rgba(100, 105, 0, 1)";
    this.element.style.backgroundImage = "url('assets/images/tree.svg')";
  }
}

class Wall extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.style.backgroundImage = "url('assets/images/wall.svg')";
  }
}
