export class DestructibleWall {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.staticImage(x, y, "Box");
    this.sprite.setImmovable(true);
    this.sprite.setData('type', 'destructible');
    this.isDestroyed = false;
  }

  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.sprite.destroy();

    //if (Math.random() < 0.3) {
      //this.scene.spawnPowerUp(this.sprite.x, this.sprite.y);
    //}
  }
}
