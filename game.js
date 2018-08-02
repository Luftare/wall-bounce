const field = document.getElementById('game-field');
const statusPower = document.querySelector('.stats__power');
const statusFitness = document.querySelector('.stats__fitness');
const CELL_SIZE = 32;
let game;
let mousePosition = [0, 0];
let mouseToHero = [10, 10];
let currentLevel = 0;

window.addEventListener('load', () => {
  game = new Game();
  game.start();

  router.add('/levels/:index', ({ index }) => {
    game.loadLevel(index)
  });

  router.update();
});

window.addEventListener('mousedown', (e) => {
  const offset = field.getBoundingClientRect();
  const position = [
    e.pageX - offset.left,
    e.pageY - offset.top
  ];
  mousePosition = position;
});

window.addEventListener('mousemove', (e) => {
  const offset = field.getBoundingClientRect();
  const position = [
    e.pageX - offset.left,
    e.pageY - offset.top
  ];
  mousePosition = position;
});

window.addEventListener('mouseup', (e) => {
  if(magnitude(game.hero.velocity) === 0) {
    const mouseToHeroLength = magnitude(mouseToHero);
    const velocity = mouseToHero.map(val => val / mouseToHeroLength).map(val => game.hero.speed * val * Math.min(game.hero.maxStretch, mouseToHeroLength));
    game.hero.charge(velocity);
  }
});
