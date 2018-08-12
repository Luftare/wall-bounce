const ITEM_SILVER_SWORD = {
  name: 'Silver Sword',
  description: '+2 power',
  slot: HAND,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    self.power += 2;
  },
  unEquip(self) {
    this.equipped = false;
    self.power -= 2;
  }
};

const ITEM_ANCIENT_RAZOR = {
  name: 'Ancient Razor',
  description: '+2 power and slice through',
  slot: HAND,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    self.power += 2;
    game.entities = game.entities.map(entity => {
      if(entity instanceof Orc) {
        entity.nonBlocking = true;
      }
      return entity;
    })
  },
  unEquip(self) {
    this.equipped = false;
    self.power -= 2;
    game.entities = game.entities.map(entity => {
      if(entity instanceof Orc) {
        entity.nonBlocking = false;
      }
      return entity;
    })
  }
};

const ITEM_STEEP_HAMMER = {
  name: 'Steel Hammer',
  description: '+4 power',
  slot: HAND,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    self.power += 4;
  },
  unEquip(self) {
    this.equipped = false;
    self.power -= 4;
  }
};

const ITEM_LEATHER_BOOTS = {
  name: 'Leather Boots',
  description: '+1 fitness',
  slot: FEET,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    self.fitness += 1;
  },
  unEquip(self) {
    this.equipped = false;
    self.fitness -= 1;
  }
};

const ITEM_LIGHT_SLIPPERS = {
  name: 'Light Slippers',
  description: 'Move freely',
  slot: FEET,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    this.temp = self.canStartMove;
    self.canStartMove = () => !self.dead && self.fitness > 0;
  },
  unEquip(self) {
    this.equipped = false;
    self.canStartMove = this.temp;
  }
};

const allItems = [ITEM_SILVER_SWORD, ITEM_STEEP_HAMMER, ITEM_ANCIENT_RAZOR, ITEM_LEATHER_BOOTS, ITEM_LIGHT_SLIPPERS];
