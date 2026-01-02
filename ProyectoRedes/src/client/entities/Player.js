// IMPORTS
import { Bomb } from "./Bomb";

// PLAYER: GESTIONA JUGADOR, MOVIMIENTO, BOMBAS Y VIDAS
export class Player {

    // FUNCIÓN QUE SIRVE PARA CREAR LA INSTANCIA DEL JUGADOR
    constructor(scene, id, x, y, playerSprite, name){

        // SE ASIGNA ESCENA Y IDENTIFICADORES
        this.scene = scene;
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;

        // STATS BASE
        this.baseLifes = 3;                        // VIDAS BASE
        this.baseSpeed = 100;                      // VELOCIDAD BASE
        this.baseQuantityUpgrade = 1;              // CANTIDAD MÁXIMA DE BOMBAS
        this.baseBombActivationUpgrade = 1;        // TIEMPO/ACTIVACIÓN DE BOMBAS (NIVEL)
        this.baseExplosionRange = 1;               // ALCANCE DE EXPLOSIÓN

        // ARRAY DE VIDAS (HEARTS)
        this.lifes = [];

        // INVULNERABILIDAD
        this.invulnerable = false;

        // SE CREAN LAS VIDAS VISUALES SEGÚN EL JUGADOR
        if(this.id == 'player1'){
            for(let i = 0; i < this.baseLifes; i++){
                this.createLifes(5 + i,0); // UI PLAYER1
            }
        }else{
            for(let i = 0; i < this.baseLifes; i++){
                this.createLifes(13 + i,0); // UI PLAYER2
            }
        }

        // CONTADOR DE BOMBAS COLOCADAS
        this.bombsPlaced = 0;

        // SPRITE: CREACIÓN Y CONFIGURACIÓN FÍSICA
        this.sprite = scene.physics.add.sprite(x, y, playerSprite); // CREA SPRITE
        this.sprite.setCollideWorldBounds(true);                    // ACTIVA COLISIÓN CON MUNDO
        this.sprite.body.setSize(this.sprite.width * 0.5, this.sprite.height * 0.3); // AJUSTA COLLIDER
        this.sprite.body.setOffset(this.sprite.width * 0.25, this.sprite.height * 0.7); // OFFSET COLLIDER
        
    }

    // FUNCIÓN QUE SIRVE PARA GESTIONAR CONTROLES Y ACCIONES DEL JUGADOR
    controls(cursors) {
        // SE TOMA VELOCIDAD BASE
        const speed = this.baseSpeed;
        let vx = 0, vy = 0;

        // SE HACE LÓGICA DE MOVIMIENTO (FLECHAS / WASD)
        if (cursors.leftKeyObj.isDown)  { vx = -speed; this.facing = 'left'; }
        else if (cursors.rightKeyObj.isDown) { vx = speed; this.facing = 'right'; }
        else if (cursors.upKeyObj.isDown)    { vy = -speed; this.facing = 'up'; }
        else if (cursors.downKeyObj.isDown)  { vy = speed; this.facing = 'down'; }

        // SE COLOCA UNA BOMBA SI SE PULSA LA TECLA Y HAY CAPACIDAD
        if (Phaser.Input.Keyboard.JustDown(cursors.bombKeyObj) && this.bombsPlaced < this.baseQuantityUpgrade) {
            this.bombsPlaced++; // INCREMENTA CONTADOR DE BOMBAS

            // SONIDO ALEATORIO ESPECIAL
            (Math.random() < 1/20 ? this.scene.sound.play('specialBomb') : this.scene.sound.play('bomb'));

            // SE OBTIENE POSICIÓN DEL GRID PARA UBICAR LA BOMBA
            this.gridPos = this.scene.mapManager.fromPosToGrid(this.sprite.body.x, this.sprite.body.y);

            // SE CREA LA BOMBA EN EL GRID
            new Bomb(this.scene, this.gridPos.x, this.gridPos.y, this.baseBombActivationUpgrade, this.baseExplosionRange, this);
        }

        // SE APLICA VELOCIDAD AL SPRITE
        this.sprite.setVelocity(vx, vy);

        // ANIMACIONES MOVIMIENTO DEL JUGADOR
        if (vx !== 0 || vy !== 0) {
            this.sprite.anims.play(`${this.name}_walk_${this.facing}`, true); // ANIMACIÓN CAMINAR
        } else {
            this.sprite.anims.play(`${this.name}_idle`, true); // ANIMACIÓN INACTIVO
        }
    }

    // FUNCIÓN QUE HACE QUE EL JUGADOR PIERDA VIDA
    takeDamage(){
        // SI ESTÁ INVULNERABLE, NO SE HACE NADA
        if(this.invulnerable){
            return;
        }

        // SONIDO DE PÉRDIDA DE VIDA
        this.scene.sound.play('loseLife', { volume: 0.3 });

        // SE ACTUALIZA UI: ÚLTIMA VIDA SE VUELVE VACÍA
        this.lifes[this.baseLifes - 1].setTexture('emptyHeart');
        this.baseLifes--; // RESTA VIDA BASE

        // SI LAS VIDAS LLEGAN A 0, SE GESTIONA FIN DE PARTIDA
        if(this.baseLifes <= 0){
            const music = this.scene.sound.get('gameMusic');
                if (music) {
                    music.stop(); // SE PARA LA MÚSICA
                }
            if(this.id == 'player1'){
                this.scene.scene.start('Player2VictoryScene'); // PLAYER2 GANA
            }else{
                this.scene.scene.start('Player1VictoryScene') // PLAYER1 GANA
            }
        }

        // SE ACTIVA INVULNERABILIDAD TEMPORAL
        this.invulnerable = true;

        // SE PROGRAMA TIMER PARA QUITAR INVULNERABILIDAD
        this.scene.time.delayedCall(1000, () => {
            this.invulnerable = false; // RESETEA INVULNERABILIDAD
        });
    }

    // FUNCIÓN QUE SIRVE PARA AÑADIR UNA VIDA
    addLife(){
        this.baseLifes++; // AUMENTA VIDAS BASE
        this.lifes[this.baseLifes - 1].setTexture('heart'); // SE ACTUALIZA UI
    }

    // FUNCIÓN QUE SIRVE PARA CREAR LOS ICONOS DE VIDA EN PANTALLA
    createLifes(x, y){
        // SE CONVIERTE DE COORDENADAS DEL GRID A POSICIÓN REAL
        this.gridPos = this.scene.mapManager.fromGridToPos(x, y);

        // CREA IMAGEN DE CORAZÓN EN LA POSICIÓN
        this.heart = this.scene.add.image(this.gridPos.x, this.gridPos.y, 'heart');

        // SE AÑADE AL ARRAY DE VIDAS
        this.lifes.push(this.heart);
    }

    // FUNCIÓN PARA EL MODO ONLINE QUE ACTUALIZA EL SPRITE EN FUNCIÓN DE LA DIRECCIÓN Y LA POSICIÓN
    applyNetworkState(state) {

        this.sprite.x = state.x; 
        this.sprite.y = state.y;

        // Dirección / animación
        if (state.facing) {
            this.facing = state.facing;
            this.sprite.anims.play(`${this.name}_walk_${this.facing}`, true);
        } else {
            this.sprite.anims.play(`${this.name}_idle`, true);
        }
    }

    // FUNCIÓN PARA EL MODO ONLINE QUE AJUSTA LOS PARÁMETROS DE LOS BOOST EN EL CLIENTE EN FUNCIÓN DE LAS STATS DEL SERVIDOR
    applyServerStats(stats) {

        if (stats.maxBombs !== undefined) {
            this.baseQuantityUpgrade = stats.maxBombs;
        }

        if (stats.explosionRange !== undefined) {
            this.baseExplosionRange = stats.explosionRange;
        }

        if (stats.activationSpeed !== undefined) {
            this.baseBombActivationUpgrade = stats.activationSpeed;
        }

        if (stats.lifes !== undefined) {
            this.syncLifesFromServer(stats.lifes);
        }
    }

    // FUNCIÓN PARA ACTUALIZAR EN EL CLIENTE LA VIDA EN BASE A LA VIDA DEL SERVIDOR DE LOS JUGADDORES
    syncLifesFromServer(serverLifes) {
        this.baseLifes = serverLifes;

        for (let i = 0; i < this.lifes.length; i++) {
            if (i < serverLifes) {
                this.lifes[i].setTexture('heart');
            } else {
                this.lifes[i].setTexture('emptyHeart');
            }
        }
    }
}