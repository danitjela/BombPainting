import { PowerUp } from "../entities/PowerUp";

export class DestructibleWall{
    constructor(scene, x, y){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.sprite = scene.physics.add.staticImage(x, y, "Box");
        this.sprite.setImmovable(true);
        this.sprite.setData('type', 'destructible');
        this.isDestroyed = false;
    }

    destroy() {
        if (this.isDestroyed) return;
            this.isDestroyed = true;

        this.sprite.destroy();

        this.scene.mapManager.destructibleWalls =
            this.scene.mapManager.destructibleWalls.filter(w => w !== this);

        if (Math.random() < 0.5) {
            const randomValue = Math.floor(Math.random() * 4);
            switch(randomValue){
                case 0:
                    new PowerUp(this.scene, this.x, this.y, 'moreBombs');
                    break;
                case 1:
                    new PowerUp(this.scene, this.x, this.y, 'biggerExplosion');
                    break;
                case 2:
                    new PowerUp(this.scene, this.x, this.y, 'fasterExplosion');
                    break;
                case 3:
                    new PowerUp(this.scene, this.x, this.y, 'moreLife');
                    break;
            }
        }
    }
}