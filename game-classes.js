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
    this.levelId = '';
    this.levelData = {};
    this.timeFactor = 1;
    this.paused = true;
    this.loop = new Loop(dt => {
      if (this.paused) return;
      this.hero.update(dt * this.timeFactor);
    });
    this.hero = null;
  }

  find(type) {
    return this.entities.find(o => o instanceof type);
  }

  loadLevel(id) {
    router.goTo(`/levels/${id}`);
  }

  handleNewLevelRequest(id = this.levelId) {
    fetch(`levels/${id}.json`)
      .then(data => data.json())
      .then(level => {
        this.levelId = id;
        this.levelData = level;
        this.globalInventory = this.globalInventory.filter((item, i, arr) => arr.indexOf(item) === i);//remove duplicate items
        field.innerHTML = "";
        document.querySelector(".story").innerHTML = parseDialog(level.mapStory);
        document.querySelector(".story").classList.remove("invisible");
        field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
        field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
        this.entities = level.entities.filter(e => e.type !== HERO).map(o => new obstacleConstructors[o.type](o));
        this.hero = new Hero(level.entities.find(e => e.type === HERO));
        this.paused = false;
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
