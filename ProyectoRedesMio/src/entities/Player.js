import { Bomb } from "./Bomb";

export class Player {

    constructor(scene, id, x, y, playerSprite, name){

        this.scene = scene;
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;

        this.baseLifes = 3;
        this.baseSpeed = 100;
        this.baseQuantityUpgrade = 1;
        this.baseBombActivationUpgrade = 1;
        this.baseExplosionRange = 1;

        this.bombsPlaced = 0;

        this.sprite = scene.physics.add.sprite(x, y, playerSprite);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(this.sprite.width * 0.5, this.sprite.height * 0.3); 
        this.sprite.body.setOffset(this.sprite.width * 0.25, this.sprite.height * 0.7);
        
    }

    controls(cursors) {
        const speed = this.baseSpeed;
        let vx = 0, vy = 0;

        if (cursors.leftKeyObj.isDown)  { vx = -speed; this.facing = 'left'; }
        else if (cursors.rightKeyObj.isDown) { vx = speed; this.facing = 'right'; }
        else if (cursors.upKeyObj.isDown)    { vy = -speed; this.facing = 'up'; }
        else if (cursors.downKeyObj.isDown)  { vy = speed; this.facing = 'down'; }

        if (Phaser.Input.Keyboard.JustDown(cursors.bombKeyObj) && this.bombsPlaced < this.baseQuantityUpgrade) {
            this.bombsPlaced++;
            this.gridPos = this.scene.mapManager.fromPosToGrid(this.sprite.x, this.sprite.y);
            new Bomb(this.scene, this.gridPos.x, this.gridPos.y, this.baseBombActivationUpgrade, this.baseExplosionRange, this);
        }

        this.sprite.setVelocity(vx, vy);

        // Animaciones
        if (vx !== 0 || vy !== 0) {
            this.sprite.anims.play(`${this.name}_walk_${this.facing}`, true);
        } else {
            this.sprite.anims.play(`${this.name}_idle`, true);
        }
    }

    takeDamage(){
        this.baseLifes--;
    }
}