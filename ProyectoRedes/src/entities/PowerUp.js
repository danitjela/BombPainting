export class PowerUp{
    constructor(scene, x, y, type){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;

        switch(this.type){
            case('moreBombs'):
                this.loadBoost('boostMoreBombs');
                break;
            case('biggerExplosion'):
                this.loadBoost('boostBiggerExplosion');
                break;
            case('fasterExplosion'):
                this.loadBoost('boostFasterExplosion');
                break;
            case('moreLife'):
                this.loadBoost('boostMoreLife');
                break;
        }
    }

    loadBoost(textureKey) {
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, textureKey);
        this.sprite.setScale(0.5);

        this.scene.players.forEach(player => {
            this.scene.physics.add.overlap(player.sprite, this.sprite, () => {
                this.applyBoost(player);
                this.sprite.destroy();
            });
        });
    }

    applyBoost(player) {
        this.scene.sound.play('powerUp', {volume: 0.5});
        switch (this.type) {
            case 'moreBombs':
                this.boostMoreBombs(player);
                break;
            case 'biggerExplosion':
                this.boostBiggerExplosion(player);
                break;
            case 'fasterExplosion':
                this.boostFasterExplosion(player);
                break;
            case 'moreLife':
                this.boostMoreLife(player);
                break;
        }
    }

    boostMoreBombs(player){
        if(player.baseQuantityUpgrade < 3){
            player.baseQuantityUpgrade++;
        }
    }

    boostBiggerExplosion(player){
        if(player.baseExplosionRange < 3){
            player.baseExplosionRange++;
        }
    }

    boostFasterExplosion(player){
        if(player.baseBombActivationUpgrade < 4){
            player.baseBombActivationUpgrade++;
        }
    }

    boostMoreLife(player){
        if(player.baseLifes < 3){
            player.addLife();
        }
    }
}