const HERO = 'hero';
const PRINCESS = 'princess';
const TREE = 'tree';
const ORC = 'orc';
const WALL = 'wall';

const types = [HERO, PRINCESS, TREE, ORC, WALL];

const CELL_SIZE = 32;
const field = document.getElementById('game-field');
let mapSize = [10, 10];
let princess = null;
let princessPosition = null;
let hero = null;
let heroPosition = null;
let selectedObstacle = 'tree';
let obstacles = [];

/*

{"mapSize":[0,0],"obstacles":[{"type":"tree","position":[2,5]},{"type":"tree","position":[4,4]},{"type":"tree","position":[6,2]},{"type":"wall","position":[2,8]},{"type":"wall","position":[3,7]},{"type":"orc","position":[1,2]},{"type":"orc","position":[3,2]},{"type":"orc","position":[9,6]},{"type":"orc","position":[9,9]}]}

*/

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
  const val = Math.floor(e.target.value / CELL_SIZE);
  mapSize[0] = val;
});

document.getElementById('map-tools__height').addEventListener('input', (e) => {
  field.style.height = `${e.target.value * CELL_SIZE}px`;
  const val = Math.floor(e.target.value / CELL_SIZE);
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
  if(type !== HERO && type !== PRINCESS) {
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      obstacles = obstacles.filter(o => o !== obstacle);
      field.removeChild(element);
    });
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
