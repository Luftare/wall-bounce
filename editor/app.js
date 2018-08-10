const appConfig = {
  el: '#root',
  data: {
    fileName: '',
    levels: [],
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
        mapSize: this.mapSize.map(val => parseInt(val)),
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

    (async () => {
      const res = await fetch('/levels');
      const json = await res.text();
      const levels = JSON.parse(json);
      this.levels = levels;
    })();
  },
  methods: {
    coordToCell(pos) {
      return pos.map(val => Math.floor(val / this.cellSize));
    },
    loadLevel(fileName) {
      (async () => {
        const res = await fetch(`/levels/${fileName}`);
        const json = await res.text();
        const levelData = JSON.parse(json);
        this.fileName = fileName;
        this.selectedEntity = null;
        for(let key in levelData) {
          this[key] = levelData[key];
        }
      })();
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
    saveLevel() {
      (async () => {
        const rawResponse = await fetch(`${window.location.href}levels/${this.fileName}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: this.encodedMapData
        });
        const response = await rawResponse.json();
        this.levels = response;
      })();
    },
    newLevel() {
      this.fileName = '.json';
      this.entities = [];
      this.mapSize = [7, 7];
      this.selectedEntity = null;
      this.initScript = '';
      this.mapStory = '';
      this.mapData = '';
      this.selectedEntityType = entityTypes[0];
    },
    addEntity(position) {
      const entity = entitySchemas[this.selectedEntityType].reduce((obj, prop) => {
        obj[prop.name] = defaultTypeValues[prop.type]();
        return obj;
      }, {type: this.selectedEntityType});
      entity.position = position;
      this.entities.push(entity);
    }
  }
};

const app = new Vue(appConfig);
