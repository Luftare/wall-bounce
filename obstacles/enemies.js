class Orc extends Obstacle {
  constructor(...props) {
    super(...props);
    this.bounciness = 0.9;
    this.element.style.backgroundImage = "url('https://forum.psnprofiles.com/applications/core/interface/imageproxy/imageproxy.php?img=http://www.pixelchampions.com/images/a/m002804.png&key=5c89352545034ca07cb4e3806a157a820ce3b915aab98d2e3ac755d6480ba137')";
  }

  onCollision() {
    game.obstacles = game.obstacles.filter(obstacle => obstacle !== this);
    this.element.classList.add('dead');
    game.timeFactor = 0.2;
    game.hero.fight(this);

    setTimeout(() => {
      game.timeFactor = 1;
    }, 200);
  }
}
