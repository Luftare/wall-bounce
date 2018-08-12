const obstacleConstructors = {
  [PRINCESS]: Princess,
  [ORC]: Orc,
  [WALL]: Wall,
  [WIND]: Wind,
  [FLOWER]: Flower,
  [TREE]: Tree,
  [WIZARD]: Wizard,
  [SPRITE]: Sprite,
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

  startLevel() {
    const level = this.levelData;
    field.innerHTML = "";
    document.querySelector(".game__level-story").innerHTML = parseDialog(level.mapStory);
    document.querySelector(".game__level-story").classList.remove("invisible");
    field.style.width = `${level.mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${level.mapSize[1] * CELL_SIZE}px`;
    this.entities = level.entities.filter(e => e.type !== HERO).map(o => new obstacleConstructors[o.type](o));
    this.hero = new Hero(level.entities.find(e => e.type === HERO));
    renderItems(allItems);
    this.paused = false;
  }

  handleNewLevelRequest(id = this.levelId) {
    this.levelId = id;
    fetch(`levels/${id}.json`)
      .then(data => data.json())
      .then(level => {
        this.levelData = level;
        this.startLevel();
      })
  }

  openDialog(text, buttonText = 'Ok.', buttonHandler = this.closeDialog.bind(this)) {
    this.pause();
    this.entities.forEach(e => {
      if(e.hovering) {
        e.borders.classList.remove('hovering');
      }
    });
    document.querySelector(".game__level-story").classList.add("invisible");
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
    this.entities.forEach(e => {
      if(e.hovering) {
        e.borders.classList.add('hovering');
      }
    });
    document.querySelector(".game__level-story").classList.remove("invisible");
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
