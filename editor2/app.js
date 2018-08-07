const appConfig = {
  el: '#root',
  data: {
    entities: [],
    cellSize: 40,
    mapSize: [7, 7],
    showEntityTools: false,
    showMapTools: false,
    selectedEntity: null,
    entityTypes: allObstacles,
    selectedEntityType: 'tree',
    initScript: '',
    mapStory: ''
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
    handleMapFieldClick(e) {
      const offset = e.target.getBoundingClientRect();
      const position = [
        e.pageX - offset.left,
        e.pageY - offset.top
      ];
      const cellPosition = this.coordToCell(position);
      this.addEntity(cellPosition);
    },
    handleEntityClick(entity) {
      this.selectedEntity = entity;
    },
    addEntity(position) {
      this.entities.push({
        type: this.selectedEntityType,
        position,
      })
    }
  }
};

const app = new Vue(appConfig);
