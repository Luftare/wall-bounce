class Princess extends Obstacle {
  constructor(conf) {
    super(conf.position, 0.7);
    entitySchemas[PRINCESS].forEach(prop => {
      if(prop.name !== POSITION) {
        this[prop.name] = conf[prop.name];
      }
    });
    this.size = CELL_SIZE * this.scale;
    this.element.classList.add("princess");
    this.element.style.position = "relative";
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE] || 'princess'}.svg')`;
    this.borders.classList.add("borders--blue");
  }

  onCollision() {
    this[ON_COLLISION] && eval(this[ON_COLLISION]);
  }
}

class Wizard extends Obstacle {
  constructor(conf) {
    super(conf.position, 0.7);
    entitySchemas[WIZARD].forEach(prop => {
      if(prop.name !== POSITION) {
        this[prop.name] = conf[prop.name];
      }
    });
    this.size = CELL_SIZE * this.scale;
    this.element.classList.add("wizard");
    this.element.style.position = "relative";
    this.element.style.backgroundImage = `url('assets/images/${conf[CUSTOM_IMAGE] || 'wizard'}.svg')`;
    this.borders.classList.add("borders--blue");
  }

  onCollision() {
    this[ON_COLLISION] && eval(this[ON_COLLISION]);
  }
}
