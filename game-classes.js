class Loop {
  constructor(cb) {
    this.then = null;
    this.running = false;
    this.onTick = cb;
  }

  tick() {
    const now = Date.now();
    const dt = now - this.then;
    this.then = now;
    this.onTick(dt / 1000);
    requestAnimationFrame(this.tick.bind(this));
  }

  start() {
    this.running = true;
    this.then = Date.now() - 16;
    this.tick();
  }
}

class Obstacle {
  constructor(position, scale = 1) {
    this.scale = scale;
    this.size = CELL_SIZE;
    this.bounciness = 0.5;
    this.position = position.map(
      val => CELL_SIZE * (val + (0.5 - scale * 0.5))
    );
    this.scale = scale;

    const element = document.createElement("div");
    element.classList = "obstacle";
    this.element = element;

    const borders = document.createElement("div");
    borders.classList = "obstacle-borders obstacle-borders--white";
    borders.style.left = `${this.position[0]}px`;
    borders.style.top = `${this.position[1]}px`;
    borders.style.width = `${this.size * this.scale}px`;
    borders.style.height = `${this.size * this.scale}px`;
    this.borders = borders;
    borders.appendChild(this.element);
    field.appendChild(borders);
  }

  onCollision() {}
}

class Game {
  constructor() {
    this.edgeLinks = [];
    this.level = 0;
    this.timeFactor = 1;
    this.paused = true;
    this.loop = new Loop(dt => {
      if (this.paused) return;
      this.hero.update(dt * this.timeFactor);
    });
    this.loadLevel(this.level);
  }

  loadLevel(index) {
    const level = levels[index];
    this.edgeLinks = level.edgeLinks || [];
    field.innerHTML = "";
    this.paused = false;
    this.level = index;
    this.smokeScreen = this.createSmokeScreen();
    document.querySelector(".story").innerHTML = parseDialog(level.story);
    document.querySelector(".story").classList.remove("invisible");
    field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
    this.hero = new Hero(level.hero);
    this.obstacles = [
      ...level.obstacles.map(o => {
        switch (o.type) {
          case "orc":
            return new Orc(o.position);
            break;
          case "tree":
            return new Tree(o.position);
            break;
          case "wall":
            return new Wall(o.position);
            break;
          case "flower":
            return new Flower(o.position);
            break;
          case "princess":
            return new Princess(o.position, o.linkIndex);
            break;
        }
      })
    ];
  }

  createSmokeScreen() {
    const element = document.createElement("div");
    element.classList.add("smoke-screen");
    element.innerHTML = `
      <div class="smoke__content">
        <div class="smoke__text"></div>
        <button class="smoke__button"></button>
      </div>
    `;
    field.appendChild(element);
    return element;
  }

  finishLevel(nextLevelIndex = this.level + 1) {
    const level = levels[this.level];
    this.paused = true;
    this.hero.element.classList.add("invisible");
    document.querySelector(".smoke__text").innerHTML = parseDialog(
      level.endNote
    );
    document.querySelector(".smoke__button").innerHTML =
      level.endNoteButtonText || "";
    document.querySelector(".smoke__button").addEventListener("click", () => {
      router.goTo(`/levels/${nextLevelIndex}`);
    });
    this.smokeScreen.classList.add("smoke-screen--visible");
    document.querySelector(".story").classList.add("invisible");
  }

  start() {
    this.loop.start();
  }
}
