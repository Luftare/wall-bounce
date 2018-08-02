class Tree extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.3;
    this.element.classList.add('tree');
  }
}

class Wall extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.classList.add('wall');
  }
}
