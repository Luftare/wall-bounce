const CELL_SIZE = 32;
const field = document.getElementById('game-field');
let mapSize = [10, 10];
let hero = null;
let heroPosition = null;
let selectedObstacle = allObstacles[0];
let obstacles = [];

window.addEventListener('load', () => {
  createObstacle(HERO, [0, 0]);
})

document.getElementById('export-json').addEventListener('click', () => {
  const story = document.getElementById('story-editor').value;
  const endNote = document.getElementById('end-note-editor').value;
  const storyScript = document.getElementById('story-script').value;
  const endNoteButtonText = document.getElementById('end-note-button-text-editor').value;
  const edgeLinks = [
    parseInt(document.getElementById('map-tools__link-top').value),
    parseInt(document.getElementById('map-tools__link-right').value),
    parseInt(document.getElementById('map-tools__link-bottom').value),
    parseInt(document.getElementById('map-tools__link-left').value)
  ];
  const data = {
    mapSize,
    hero: heroPosition,
    obstacles,
    story,
    endNote,
    endNoteButtonText,
    edgeLinks,
    storyScript
  };
  const json = JSON.stringify(data);
  document.getElementById('json-editor').value = json;
})

document.getElementById('json-editor').addEventListener('input', (e) => {
    obstacles = [];
    const json = e.target.value;
    const data = JSON.parse(json);
    mapSize = data.mapSize;
    if(data.edgeLinks && data.edgeLinks.find(e => !!e)) {
      document.getElementById('map-tools__link-top').value = data.edgeLinks[0] || '';
      document.getElementById('map-tools__link-right').value = data.edgeLinks[1] || '';
      document.getElementById('map-tools__link-bottom').value = data.edgeLinks[2] || '';
      document.getElementById('map-tools__link-left').value = data.edgeLinks[3] || '';
    }
    document.getElementById('story-editor').value = data.story || '';
    document.getElementById('story-script').value = data.storyScript || '';
    document.getElementById('end-note-editor').value = data.endNote || '';
    document.getElementById('end-note-button-text-editor').value = data.endNoteButtonText || '';
    document.getElementById('map-tools__width').value = data.mapSize[0];
    document.getElementById('map-tools__height').value = data.mapSize[1];
    field.style.width = `${mapSize[0] * CELL_SIZE}px`;
    field.style.height = `${mapSize[1] * CELL_SIZE}px`;
    data.obstacles.forEach(obstacle => createObstacle(obstacle.type, obstacle.position, obstacle));
    createObstacle(HERO, data.hero);
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

allObstacles.forEach(type => {
  const container = document.querySelector('.character-tools__options');
  const input = document.createElement('input');
  const label = document.createElement('label');
  input.type = 'radio';
  input.id = `character-tools__${type}`;
  input.name = 'character-select';
  input.hidden = true;
  input.checked = type === selectedObstacle;
  input.addEventListener('click', () => {
    selectedObstacle = type;
  });
  label.setAttribute('for', `character-tools__${type}`);
  label.innerHTML = type;
  container.appendChild(input);
  container.appendChild(label);
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
