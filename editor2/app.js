const appConfig = {
  el: '#root',
  data: {
    entities: [],
    cellSize: 40,
    mapSize: [7, 7],
    showEntityTools: false,
    showMapTools: true,
    selectedEntity: null,
    entityTypes,
    selectedEntityType: entityTypes[0],
    initScript: '',
    mapStory: '',
    mapData: '',
  },
  computed: {
    encodedMapData() {
      const data = {
        mapSize: this.mapSize,
        entities: this.entities.map(e => {
          e[POSITION] = e[POSITION].map(val => parseInt(val));
          return e;
        }),
        mapStory: this.mapStory,
        initScript: this.initScript,
      };
      return JSON.stringify(data);
    }
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          this.selectedEntity = null;
          break;
        case 'x':
          this.entities = this.entities.filter(entity => entity !== this.selectedEntity);
          break;
      }
    });
  },
  methods: {
    coordToCell(pos) {
      return pos.map(val => Math.floor(val / this.cellSize));
    },
    parseImportedMapData(e) {
      const data = JSON.parse(e.target.value);
      for(let key in data) {
        this[key] = data[key];
      }
    },
    handleMapFieldClick(e) {
      const offset = e.target.getBoundingClientRect();
      const position = [
        e.pageX - offset.left,
        e.pageY - offset.top
      ];
      const cellPosition = this.coordToCell(position);
      this.addEntity(cellPosition);
    },
    setSelectedEntityType(type) {
      const newEntity = entitySchemas[type].reduce((obj, prop) => {
        obj[prop.name] = defaultTypeValues[prop.type]();
        return obj;
      }, {type})
      newEntity.position = this.selectedEntity.position;
      this.entities = this.entities.filter(e => e !== this.selectedEntity);
      this.entities.push(newEntity);
      this.selectedEntity = newEntity;
    },
    handleEntityClick(entity) {
      this.selectedEntity = entity;
    },
    addEntity(position) {
      const entity = entitySchemas[this.selectedEntityType].reduce((obj, prop) => {
        obj[prop.name] = defaultTypeValues[prop.type]();
        return obj;
      }, {type: this.selectedEntityType})
      entity.position = position;
      this.entities.push(entity);
    }
  }
};

const app = new Vue(appConfig);
