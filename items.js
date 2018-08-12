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

const ITEM_STEEP_HAMMER = {
  name: 'Steel Hammer',
  description: '+3 power',
  slot: HAND,
  equipped: false,
  owned: false,
  equip(self) {
    this.equipped = true;
    self.power += 3;
  },
  unEquip(self) {
    this.equipped = false;
    self.power -= 3;
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

const allItems = [ITEM_SILVER_SWORD, ITEM_STEEP_HAMMER, ITEM_LEATHER_BOOTS];
