const appConfig = {
  el: '#root',
  data: {
    entities: [],
    cellSize: 40,
    mapCellsX: 7,
    mapCellsY: 7,
    showEntityTools: false,
    showMapTools: false,
    selectedEntity: null,
    entityTypes: ['tree', 'wall', 'orc', 'princess'],
    selectedEntityType: 'tree',
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
      console.log("adding,,.")
      this.entities.push({
        type: this.selectedEntityType,
        position,
      })
    }
  }
};

const app = new Vue(appConfig);
