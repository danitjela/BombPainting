import { Explosion } from "./Explosion";

export class Bomb{
    constructor(scene, x, y, activationSpeed, explosionRange, player){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.activationSpeed = activationSpeed;
        this.explosionRange = explosionRange;
        this.player = player;

        this.worldPos = this.scene.mapManager.fromGridToPos(this.x, this.y);
        this.sprite = scene.physics.add.sprite(this.worldPos.x, this.worldPos.y, 'bomb1');
        this.sprite.anims.play('prepBomb');

        this.scene.players.forEach(player => {
            this.scene.physics.add.collider(player.sprite, this.sprite);
        });

        const delay = [4000, 3500, 3000, 2500][activationSpeed - 1] || 4000;

        scene.time.delayedCall(delay, () => {
            this.sprite.anims.play('explosionBomb');
            this.sprite.once('animationcomplete', () => {
                this.sprite.destroy();
                this.player.bombsPlaced--;
                new Explosion(this.scene, this.worldPos.x, this.worldPos.y, this.explosionRange, this.player);
            });
        });
    }
}