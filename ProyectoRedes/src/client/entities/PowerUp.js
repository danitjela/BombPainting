// FUNCIÓN QUE SIRVE PARA CREAR Y GESTIONAR UN POWERUP EN LA ESCENA
export class PowerUp{
    // FUNCIÓN QUE SIRVE PARA INICIALIZAR EL POWERUP Y CARGAR SU TEXTURA SEGÚN TIPO
    constructor(scene, x, y, type){
        // ASIGNA ESCENA
        this.scene = scene;
        // ASIGNA POSICIÓN X
        this.x = x;
        // ASIGNA POSICIÓN Y
        this.y = y;
        // ASIGNA TIPO DE POWERUP
        this.type = type;

        // SEGÚN EL TIPO, CARGA LA TEXTURA/BOOST CORRESPONDIENTE
        switch(this.type){
            case('moreBombs'):
                // LLAMA A loadBoost CON LA TEXTURA PARA MÁS BOMBAS
                this.loadBoost('boostMoreBombs');
                break;
            case('biggerExplosion'):
                // LLAMA A loadBoost CON LA TEXTURA PARA EXPLOSIÓN MÁS GRANDE
                this.loadBoost('boostBiggerExplosion');
                break;
            case('fasterExplosion'):
                // LLAMA A loadBoost CON LA TEXTURA PARA EXPLOSIÓN MÁS RÁPIDA
                this.loadBoost('boostFasterExplosion');
                break;
            case('moreLife'):
                // LLAMA A loadBoost CON LA TEXTURA PARA MÁS VIDA
                this.loadBoost('boostMoreLife');
                break;
        }
    }

    // FUNCIÓN QUE SIRVE PARA CREAR EL SPRITE DEL POWERUP Y CONFIGURAR LA COLISIÓN CON LOS JUGADORES
    loadBoost(textureKey) {
        // CREA SPRITE FÍSICO EN LA ESCENA
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, textureKey);
        // AJUSTA ESCALA DEL SPRITE
        this.sprite.setScale(0.5);

        // RECORRE CADA JUGADOR DE LA ESCENA
        this.scene.players.forEach(player => {
            // CONFIGURA OVERLAP ENTRE EL SPRITE DEL JUGADOR Y EL POWERUP
            this.scene.physics.add.overlap(player.sprite, this.sprite, () => {
                if(this.scene.mode === 'local'){
                    // APLICA EL BOOST AL JUGADOR
                    this.applyBoost(player);
                    // DESTRUYE EL SPRITE DEL POWERUP TRAS RECOGERLO
                    this.sprite.destroy();
                }else{
                    const gridPos = this.scene.mapManager.fromPosToGrid(this.x, this.y);

                    this.scene.ws.send(JSON.stringify({
                        type: 'powerupPickup',
                        x: gridPos.x,
                        y: gridPos.y
                    }));

                    this.sprite.destroy();
                }
            });
        });
    }

    // FUNCIÓN QUE SIRVE PARA REPRODUCIR SONIDO Y ENCAMINAR LA APLICACIÓN DEL EFECTO SEGÚN TIPO
    applyBoost(player) {
        // REPRODUCE EFECTO SONORO DE POWERUP
        this.scene.sound.play('powerUp', {volume: 0.5});
        // SEGÚN TIPO, EJECUTA LA FUNCIÓN DE BOOST CORRESPONDIENTE
        switch (this.type) {
            case 'moreBombs':
                // LLAMA A AUMENTAR CANTIDAD DE BOMBAS
                this.boostMoreBombs(player);
                break;
            case 'biggerExplosion':
                // LLAMA A AUMENTAR ALCANCE DE EXPLOSIÓN
                this.boostBiggerExplosion(player);
                break;
            case 'fasterExplosion':
                // LLAMA A REDUCIR TIEMPO DE ACTIVACIÓN (HACERLA MÁS RÁPIDA)
                this.boostFasterExplosion(player);
                break;
            case 'moreLife':
                // LLAMA A AÑADIR VIDA
                this.boostMoreLife(player);
                break;
        }
    }

    // FUNCIÓN QUE SIRVE PARA AUMENTAR EL NÚMERO BASE DE BOMBAS DEL JUGADOR (HASTA LÍMITE)
    boostMoreBombs(player){
        // COMPRUEBA LÍMITE MÁXIMO DE UPGRADE
        if(player.baseQuantityUpgrade < 3){
            // AUMENTA EL UPGRADE DE CANTIDAD DE BOMBAS
            player.baseQuantityUpgrade++;
        }
    }

    // FUNCIÓN QUE SIRVE PARA AUMENTAR EL ALCANCE DE LA EXPLOSIÓN DEL JUGADOR (HASTA LÍMITE)
    boostBiggerExplosion(player){
        // COMPRUEBA LÍMITE MÁXIMO DE ALCANCE
        if(player.baseExplosionRange < 3){
            // AUMENTA EL RANGO DE EXPLOSIÓN
            player.baseExplosionRange++;
        }
    }

    // FUNCIÓN QUE SIRVE PARA REDUCIR EL TIEMPO DE ACTIVACIÓN DE LA BOMBA (HACERLA MÁS RÁPIDA) HASTA LÍMITE
    boostFasterExplosion(player){
        // COMPRUEBA LÍMITE MÁXIMO DE UPGRADE DE ACTIVACIÓN
        if(player.baseBombActivationUpgrade < 4){
            // AUMENTA EL UPGRADE DE ACTIVACIÓN (EFECTO: MÁS RÁPIDO)
            player.baseBombActivationUpgrade++;
        }
    }

    // FUNCIÓN QUE SIRVE PARA CONCEDER UNA VIDA EXTRA AL JUGADOR SI NO SUPERA EL LÍMITE
    boostMoreLife(player){
        // COMPRUEBA LÍMITE DE VIDAS
        if(player.baseLifes < 3){
            // AÑADE VIDA AL JUGADOR MEDIANTE SU MÉTODO
            player.addLife();
        }
    }
}