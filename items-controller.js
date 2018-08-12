document.querySelector(".items__toggle").addEventListener("click", (e) => {
  document.querySelector(".items").classList.add("items--open");
});

document.querySelector(".items__close").addEventListener("click", (e) => {
  document.querySelector(".items").classList.remove("items--open");
});

function renderItems() {
  if(!allItems.find(item => item.owned)) document.querySelector('.items__toggle').classList.add('hidden');
  const containers = {
    [HAND]: document.querySelector('.items__container--hand'),
    [CHEST]: document.querySelector('.items__container--chest'),
    [FEET]: document.querySelector('.items__container--feet')
  };
  for(let key in containers) {
    containers[key].innerHTML = '';
  }
  allItems.forEach(item => {
    if(item.owned) {
      const element = document.createElement('div');
      element.addEventListener('click', (e) => {
        if(item.equipped) {
          game.hero.unEquipItem(item);
        } else {
          game.hero.equipItem(item);
        }
        renderItems();

      })
      element.classList.add('item-icon');
      item.equipped && element.classList.add('item-icon--equipped');
      element.innerHTML = `
        <div class='item-icon__name'>${item.name}</div>
        <div class='item-icon__description'>${item.description}</div>
      `;
      containers[item.slot].appendChild(element);
    }
  })
}
