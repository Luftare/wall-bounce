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
    this.levelId = 0;
    this.levelData = {};
    this.timeFactor = 1;
    this.paused = true;
    this.loop = new Loop(dt => {
      if (this.paused) return;
      this.hero.update(dt * this.timeFactor);
    });
    this.loadLevel(this.levelId);
  }

  find(type) {
    return this.obstacles.find(o => o instanceof type);
  }

  loadLevel(id = this.levelId) {
    fetch(`levels/${id}.json`)
      .then(data => data.json())
      .then(level => {
        this.levelId = id;
        this.levelData = level;
        this.globalInventory = this.globalInventory.filter((item, i, arr) => arr.indexOf(item) === i);//remove duplicate items
        this.edgeLinks = level.edgeLinks || [];
        field.innerHTML = "";
        this.paused = false;
        this.storyScript = level.storyScript;
        document.querySelector(".story").innerHTML = parseDialog(level.story);
        document.querySelector(".story").classList.remove("invisible");
        field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
        field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
        this.hero = new Hero(level.hero);
        this.globalInventory.forEach(item => item.equip(this.hero));
        this.obstacles = level.obstacles.map(o => new obstacleConstructors[o.type](o));
      })
  }

  openDialog(text, buttonText = 'Ok.', buttonHandler = this.closeDialog.bind(this)) {
    this.pause();
    if(document.querySelector('.game-dialog')) field.removeChild(this.dialog);
    const element = document.createElement("div");
    element.classList.add("game-dialog");
    element.classList.add("game-dialog--visible");
    element.innerHTML = `
      <div class="game-dialog__content">
        <div class="game-dialog__text">${text}</div>
        <button class="game-dialog__button">${buttonText}</button>
      </div>
    `;
    field.appendChild(element);
    document.querySelector(".game-dialog__button").addEventListener("click", buttonHandler);
    this.dialog = element;
  }

  closeDialog() {
    this.resume();
    if(this.dialog) {
      field.removeChild(this.dialog);
    }
  }

  finishLevel(nextLevelId = this.levelId + 1) {
    const level = this.levelData;
    const text = parseDialog(level.endNote);
    const buttonText = level.endNoteButtonText;
    const buttonHandler = () => {
      router.goTo(`/levels/${nextLevelId}`);
    };
    this.openDialog(text, buttonText, buttonHandler);
    this.hero.element.classList.add("invisible");
    document.querySelector(".story").classList.add("invisible");
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  start() {
    this.loop.start();
  }
}
