const HERO = 'hero';
const PRINCESS = 'princess';
const TREE = 'tree';
const ORC = 'orc';
const WALL = 'wall';
const FLOWER = 'flower';
const WIND = 'wind';
const WIZARD = 'wizard';

const ON_COLLISION = 'ON_COLLISION';
const ON_EDGE_COLLISION = 'ON_EDGE_COLLISION';

const POSITION = 'position';
const CUSTOM_IMAGE = 'CUSTOM_IMAGE';

const TOP = 'TOP';
const BOTTOM = 'BOTTOM';

const UP = 'UP';
const DOWN = 'DOWN'
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const SCRIPT = 'PROR_SCRIPT';
const VECTOR = 'PROP_VECTOR';
const DIRECTION = 'PROP_DIRECTION';
const STRING = 'PROP_STRING';
const DIALOG = 'PROP_DIALOG';
const NUMBER = 'PROP_NUMBER';
const TEXT = 'PROP_TEXT';

const events = [ON_COLLISION, ON_EDGE_COLLISION];
const entityTypes = [HERO, PRINCESS, WIZARD, TREE, ORC, WALL, FLOWER, WIND];
const directions = [UP, DOWN, LEFT, RIGHT];

const defaultTypeValues = {
  [SCRIPT]: () => '',
  [VECTOR]: () => [0, 0],
  [DIRECTION]: () => 'UP',
  [STRING]: () => '',
  [DIALOG]: () => '',
  [TEXT]: () => '',
  [NUMBER]: () => 0,
};

const defaultSchemas = [
  {
    name: POSITION,
    type: VECTOR,
  },
  {
    name: CUSTOM_IMAGE,
    type: STRING
  }
];

const entitySchemas = {
  [HERO]: [
    ...defaultSchemas,
    {
      name: ON_EDGE_COLLISION,
      type: SCRIPT,
    }
  ],
  [PRINCESS]: [
    ...defaultSchemas,
    {
      name: ON_COLLISION,
      type: SCRIPT
    }
  ],
  [WIZARD]: [
    ...defaultSchemas,
    {
      name: ON_COLLISION,
      type: SCRIPT
    }
  ],
  [TREE]: [...defaultSchemas,],
  [ORC]: [...defaultSchemas,],
  [WALL]: [...defaultSchemas,],
  [FLOWER]: [
    ...defaultSchemas,
    {
      name: ON_COLLISION,
      type: SCRIPT
    }
  ],
  [WIND]: [
    ...defaultSchemas,
    {
      name: 'direction',
      type: DIRECTION
    }
  ],
};
