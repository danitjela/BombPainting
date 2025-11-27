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
        this.lifes = [];
        this.invulnerable = false;
        if(this.id == 'player1'){
            for(let i = 0; i < this.baseLifes; i++){
                this.createLifes(5 + i,0);
            }
        }else{
            for(let i = 0; i < this.baseLifes; i++){
                this.createLifes(13 + i,0);
            }

        }


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
            (Math.random() < 1/20 ? this.scene.sound.play('specialBomb') : this.scene.sound.play('bomb'));
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
        if(this.invulnerable){
            return;
        }
        this.scene.sound.play('loseLife', { volume: 0.3 });
        this.lifes[this.baseLifes - 1].setTexture('emptyHeart');
        this.baseLifes--;

        if(this.baseLifes <= 0){
            const music = this.scene.sound.get('gameMusic');
                if (music) {
                    music.stop();
                }
            if(this.id == 'player1'){
                this.scene.scene.start('Player2VictoryScene');
            }else{
                this.scene.scene.start('Player1VictoryScene')
            }
        }

        this.invulnerable = true;

        this.scene.time.delayedCall(1000, () => {
            this.invulnerable = false;
        });
    }

    addLife(){
        this.baseLifes++;
        this.lifes[this.baseLifes - 1].setTexture('heart');
    }

    createLifes(x, y){
        this.gridPos = this.scene.mapManager.fromGridToPos(x, y);
        this.heart = this.scene.add.image(this.gridPos.x, this.gridPos.y, 'heart');
        this.lifes.push(this.heart);
    }
}