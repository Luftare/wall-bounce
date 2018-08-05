const obstacleConstructors = {
  [PRINCESS]: Princess,
  [ORC]: Orc,
  [WALL]: Wall,
  [WIND]: Wind,
  [FLOWER]: Flower,
  [TREE]: Tree,
  [WIZARD]: Wizard
};

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


class Game {
  constructor() {
    this.globalInventory = [];
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

  find(type) {
    return this.obstacles.find(o => o instanceof type);
  }

  loadLevel(index) {
    const level = levels[index];
    this.globalInventory = this.globalInventory.filter((item, i, arr) => arr.indexOf(item) === i);//remove duplicates
    this.edgeLinks = level.edgeLinks || [];
    field.innerHTML = "";
    this.paused = false;
    this.level = index;
    this.storyScript = level.storyScript;
    this.smokeScreen = this.createSmokeScreen();
    document.querySelector(".story").innerHTML = parseDialog(level.story);
    document.querySelector(".story").classList.remove("invisible");
    field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
    this.hero = new Hero(level.hero);
    this.globalInventory.forEach(item => item.equip(this.hero));
    this.obstacles = level.obstacles.map(o => new obstacleConstructors[o.type](o));
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
