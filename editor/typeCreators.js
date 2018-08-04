function createObstacle(type, position, conf = {}) {
  switch (type) {
    case WIND:
      createWind(position, conf.direction);
      break;
    default:
      createGenericObstacle(type, position);
  }
}

function createWind(position, direction = 'UP') {
  const element = document.createElement('div');
  const directionInput = document.createElement('input');
  directionInput.value = direction;
  directionInput.classList.add('wind-direction');
  directionInput.addEventListener('click', (e) => e.stopPropagation());
  directionInput.addEventListener('input', (e) => {
    obstacle.direction = e.target.value;
  });
  element.classList.add('obstacle');
  element.classList.add('wind');
  element.style.left = `${position[0] * CELL_SIZE}px`;
  element.style.top = `${position[1] * CELL_SIZE}px`;
  element.innerHTML = 'wind';
  element.appendChild(directionInput);
  const obstacle = {
    type: WIND,
    direction,
    position,
  };
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedObstacle = WIND;
    document.getElementById(`character-tools__${type}`).checked = true;
    obstacles = obstacles.filter(o => o !== obstacle);
    field.removeChild(element);
  });
  obstacles.push(obstacle);
  field.appendChild(element);
}

function createGenericObstacle(type, position, linkIndex) {
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
