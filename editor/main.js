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
let hero = null;
let heroPosition = null;
let selectedObstacle = 'princess';
let obstacles = [];

window.addEventListener('load', () => {
  createObstacle(HERO, [0, 0]);
})

document.getElementById('export-json').addEventListener('click', () => {
  const story = document.getElementById('story-editor').value;
  const endNote = document.getElementById('end-note-editor').value;
  const endNoteButtonText = document.getElementById('end-note-button-text-editor').value;
  const data = {
    mapSize,
    hero: heroPosition,
    obstacles,
    story,
    endNote,
    endNoteButtonText
  };
  const json = JSON.stringify(data);
  document.getElementById('json-editor').value = json;
})

document.getElementById('json-editor').addEventListener('input', (e) => {
  try {
    obstacles = [];
    const json = e.target.value;
    const data = JSON.parse(json);
    mapSize = data.mapSize;
    document.getElementById('story-editor').value = data.story || '';
    document.getElementById('end-note-editor').value = data.endNote || '';
    document.getElementById('end-note-button-text-editor').value = data.endNoteButtonText || '';
    field.style.width = `${mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${mapSize[1] * CELL_SIZE}px`;
    data.obstacles.forEach(obstacle => createObstacle(obstacle.type, obstacle.position));
    createObstacle(HERO, data.hero);
  }
  catch(err) {

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
  const fieldPosition = position.map(val => Math.floor(val / CELL_SIZE));
  createObstacle(selectedObstacle, fieldPosition);
})

function createObstacle(type, position, linkIndex) {
  const element = document.createElement('div');
  const levelLink = document.createElement('input');
  levelLink.value = linkIndex || '';
  levelLink.classList.add('obstacle__level-link');
  levelLink.addEventListener('click', (e) => e.stopPropagation());
  levelLink.addEventListener('input', (e) => {
    obstacle.linkIndex = e.target.value;
  });
  element.classList.add('obstacle');
  element.classList.add(type);
  element.style.left = `${position[0] * CELL_SIZE}px`;
  element.style.top = `${position[1] * CELL_SIZE}px`;
  element.innerHTML = type;
  element.appendChild(levelLink);
  const obstacle = {
    type,
    position,
    linkIndex
  };
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedObstacle = type;
    document.getElementById(`character-tools__${type}`).checked = true;
    if(type !== HERO) {
      obstacles = obstacles.filter(o => o !== obstacle);
      field.removeChild(element);
    }
  });
  if(type !== HERO) {
    obstacles.push(obstacle);
  }

  if(type === HERO) {
    if(hero) field.removeChild(hero);
    hero = element;
    heroPosition = position;
  }
  field.appendChild(element);
}
