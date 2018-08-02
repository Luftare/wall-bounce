function getSquareCollisionSide(a, b) {
  const xCollision = a.position[0] + a.size > b.position[0] && a.position[0] < b.position[0] + b.size;
  const yCollision = a.position[1] + a.size > b.position[1] && a.position[1] < b.position[1] + b.size;
  if(xCollision && yCollision) {
    const overlapLeft = a.position[0] + a.size - b.position[0];
    const overlapTop = a.position[1] + a.size - b.position[1];
    const overlapRight = b.position[0] + b.size - a.position[0];
    const overlapBottom = b.position[1] + b.size - a.position[1];
    const overlaps = [overlapTop, overlapRight, overlapBottom, overlapLeft];
    const smallestPositiveOverlapIndex = overlaps.reduce((acc, overlap, i, arr) => overlap > 0 && overlap < arr[acc]? i : acc, 0);
    return ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'][smallestPositiveOverlapIndex];
  } else {
    return null;
  }
}

function magnitude(vec) {
  return Math.sqrt(vec.reduce((acc, val) => acc + val ** 2, 0));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseDialog(text = '') {
  let res = text
    .split('HERO:').join('<br><span class="speech speech--hero">HERO:</span>')
    .split('PRINCESS:').join('<br><span class="speech speech--princess">PRINCESS:</span>')
    .split('ORC:').join('<br><span class="speech speech--orc">ORC:</span>')
  if(res.substr(0,4) === '<br>') res = res.substr(4);
  return res;
}
