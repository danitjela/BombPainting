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
        this.sprite.setImmovable(true);
        this.sprite.anims.play('prepBomb');

        this.scene.players.forEach(p => {
            this.scene.physics.add.collider(p.sprite, this.sprite);
        });

        
        this.scene.physics.world.removeCollider(
            this.scene.physics.add.collider(this.player.sprite, this.sprite)
        );

        const checkExit = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                const gridPosPlayer = this.scene.mapManager.fromPosToGrid(this.player.sprite.x, this.player.sprite.y);
                const gridPosBomb = this.scene.mapManager.fromPosToGrid(this.worldPos.x, this.worldPos.y);

                if (gridPosPlayer.x !== gridPosBomb.x || gridPosPlayer.y !== gridPosBomb.y) {
                    this.scene.physics.add.collider(this.player.sprite, this.sprite);
                    checkExit.remove();
                }
            },
            loop: true
        });

        const delay = [4000, 3500, 3000, 2500][activationSpeed - 1] || 4000;

        scene.time.delayedCall(delay, () => {
            this.sprite.anims.play('explosionBomb');
            this.scene.sound.play('explosion');
            this.sprite.once('animationcomplete', () => {
                this.sprite.destroy();
                this.player.bombsPlaced--;
                new Explosion(this.scene, this.worldPos.x, this.worldPos.y, this.explosionRange, this.player);
            });
        });
    }
}