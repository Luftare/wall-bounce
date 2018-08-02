class Tree extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.3;
    this.element.style.backgroundImage = "url('assets/images/tree.svg')";
  }
}

class Wall extends Obstacle {
  constructor(...props) {
    super(...props);
    this.element.style.backgroundImage = "url('https://orig00.deviantart.net/1502/f/2014/155/5/3/walltile_1_by_sarahstudiosart-d7l2g11.png')";
  }
}
