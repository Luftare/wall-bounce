const CELL_SIZE = 32;
const field = document.getElementById('game-field');
let princess = null;
let hero = null;
let selectedObstacle = 'tree';

document.getElementById('map-tools__width').addEventListener('input', (e) => {
  field.style.width = `${e.target.value * CELL_SIZE}px`;
});

document.getElementById('map-tools__height').addEventListener('input', (e) => {
  field.style.height = `${e.target.value * CELL_SIZE}px`;
});

['hero', 'princess', 'tree', 'orc', 'wall'].forEach(type => {
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
  const gridPosition = position.map(val => Math.floor(val / CELL_SIZE) * CELL_SIZE);
  createObstacle(selectedObstacle, gridPosition);
})

function createObstacle(type, position) {
  const element = document.createElement('div');
  element.classList.add('obstacle');
  element.classList.add(type);
  element.style.left = `${position[0]}px`;
  element.style.top = `${position[1]}px`;
  element.innerHTML = type;
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    field.removeChild(element);
  });
  if(type === 'hero') {
    if(hero) field.removeChild(hero);
    hero = element;
  }
  if(type === 'princess') {
    if(princess) field.removeChild(princess);
    princess = element;
  }
  field.appendChild(element);
}
