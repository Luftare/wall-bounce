//warrior tries to resque princess
//obstacles as grid positions
//trees and rocks bounce back the warrior
//orcs will bounce once
//other baddies might take more damage before they disappear and let through
//

const field = document.getElementById('game-field');
let game;
let mousePosition = [0, 0];
let mouseToHero = [10, 10];

window.addEventListener('load', () => {
  game = new Game();
  game.start();
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
  const mouseToHeroLength = magnitude(mouseToHero);
  const velocity = mouseToHero.map(val => val / mouseToHeroLength).map(val => game.hero.speed * val * Math.min(game.hero.maxStretch, mouseToHeroLength));
  game.hero.velocity = velocity;
});
