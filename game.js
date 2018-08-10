const field = document.getElementById("game-field");
const gameContainer = document.querySelector(".game-container");
const statusPower = document.querySelector(".stats__power");
const statusFitness = document.querySelector(".stats__fitness");
const CELL_SIZE = 64;
let game;
let mousePosition = [0, 0];
let mouseToHero = [10, 10];
let currentLevel = 0;

window.addEventListener("load", () => {
  game = new Game();
  game.start();

  router.add("/levels/:index", ({ index }) => {
    game.handleNewLevelRequest(index);
  });

  router.add('', () => {
    game.handleNewLevelRequest('meetPrincessAtGarden');
  })


  router.update();
});

gameContainer.addEventListener("mousedown", e => {
  const scrollOffset = [
    window.pageXOffset || document.documentElement.scrollLeft,
    window.pageYOffset || document.documentElement.scrollTop
  ];
  const offset = field.getBoundingClientRect();
  const position = [e.pageX - offset.left - scrollOffset[0], e.pageY - offset.top - scrollOffset[1]];
  mousePosition = position;
});

gameContainer.addEventListener("mousemove", e => {
  const scrollOffset = [
    window.pageXOffset || document.documentElement.scrollLeft,
    window.pageYOffset || document.documentElement.scrollTop
  ];
  const offset = field.getBoundingClientRect();
  const position = [e.pageX - offset.left - scrollOffset[0], e.pageY - offset.top - scrollOffset[1]];
  mousePosition = position;
});

gameContainer.addEventListener("mouseup", e => {
  if (magnitude(game.hero.velocity) === 0) {
    const mouseToHeroLength = magnitude(mouseToHero);
    const velocity = mouseToHero
      .map(val => val / mouseToHeroLength)
      .map(
        val =>
          game.hero.speed *
          val *
          Math.min(game.hero.maxStretch, mouseToHeroLength)
      );
    game.hero.charge(velocity);
  }
});

gameContainer.addEventListener("touchstart", e => {
  const scrollOffset = [
    window.pageXOffset || document.documentElement.scrollLeft,
    window.pageYOffset || document.documentElement.scrollTop
  ];
  const offset = field.getBoundingClientRect();
  const position = [e.changedTouches[0].pageX - offset.left - scrollOffset[0], e.changedTouches[0].pageY - offset.top - scrollOffset[1]];
  mousePosition = position;
  mouseToHero = game.hero.position.map(
    (val, i) => val - mousePosition[i] + game.hero.size / 2
  );
});

gameContainer.addEventListener("touchend", e => {
  if (magnitude(game.hero.velocity) === 0) {
    mouseToHero = game.hero.position.map(
      (val, i) => val - mousePosition[i] + game.hero.size / 2
    );
    const mouseToHeroLength = magnitude(mouseToHero);
    const velocity = mouseToHero
      .map(val => val / mouseToHeroLength)
      .map(
        val =>
          game.hero.speed *
          val *
          Math.min(game.hero.maxStretch, mouseToHeroLength)
      );
    game.hero.charge(velocity);
  }
});
