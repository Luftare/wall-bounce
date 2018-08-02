const HERO = 'hero';
const PRINCESS = 'princess';
const TREE = 'tree';
const ORC = 'orc';
const WALL = 'wall';
const FLOWER = 'flower';

const types = [HERO, PRINCESS, TREE, ORC, WALL, FLOWER];

const CELL_SIZE = 32;
const field = document.getElementById('game-field');
let mapSize = [10, 10];
let princess = null;
let princessPosition = null;
let hero = null;
let heroPosition = null;
let selectedObstacle = 'princess';
let obstacles = [];

window.addEventListener('load', () => {
  createObstacle(HERO, [0, 0]);
  createObstacle(PRINCESS, [5, 5]);
})

document.getElementById('export-json').addEventListener('click', () => {
  const data = {
    mapSize,
    hero: heroPosition,
    princess: princessPosition,
    obstacles
  };
  const json = JSON.stringify(data);
  document.getElementById('json-editor').value = json;
})

document.getElementById('json-editor').addEventListener('input', (e) => {
  const json = e.target.value;
  try {
    const data = JSON.parse(json);
    mapSize = data.mapSize;
    obstacles = data.obstacles;
    field.style.width = `${mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${mapSize[1] * CELL_SIZE}px`;
    obstacles.forEach(obstacle => createObstacle(obstacle.type, obstacle.position));
    createObstacle(HERO, data.hero);
    createObstacle(PRINCESS, data.princess);
  }
  catch(err) {
    throw new Error(err)
  }
});

document.getElementById('map-tools__width').addEventListener('input', (e) => {
  field.style.width = `${e.target.value * CELL_SIZE}px`;
  const val = parseInt(e.target.value);
  mapSize[0] = val;
});

document.getElementById('map-tools__height').addEventListener('input', (e) => {
  field.style.height = `${e.target.value * CELL_SIZE}px`;
  const val = parseInt(e.target.value);
  mapSize[1] = val;
});

types.forEach(type => {
  document.getElementById(`character-tools__${type}`).addEventListener('click', () => {
    selectedObstacle = type;
  });
})

field.addEventListener('click', (e) => {
  const offset = field.getBoundingClientRect();
  const position = [
    e.pageX - offset.left,
    e.pageY - offset.top
  ];
  const gridPosition = position.map(val => Math.floor(val / CELL_SIZE));
  createObstacle(selectedObstacle, gridPosition);
})

function createObstacle(type, position) {
  const element = document.createElement('div');
  element.classList.add('obstacle');
  element.classList.add(type);
  element.style.left = `${position[0] * CELL_SIZE}px`;
  element.style.top = `${position[1] * CELL_SIZE}px`;
  element.innerHTML = type;
  const obstacle = {
    type,
    position
  };
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedObstacle = type;
    document.getElementById(`character-tools__${type}`).checked = true;
    if(type !== HERO && type !== PRINCESS) {
      obstacles = obstacles.filter(o => o !== obstacle);
      field.removeChild(element);
    }
  });
  if(type !== HERO && type !== PRINCESS) {
    obstacles.push(obstacle);
  }

  if(type === HERO) {
    if(hero) field.removeChild(hero);
    hero = element;
    heroPosition = position;
  }
  if(type === PRINCESS) {
    if(princess) field.removeChild(princess);
    princess = element;
    princessPosition = position;
  }
  field.appendChild(element);
}
