// SE IMPORTA CLASE EXPLOSION PARA GESTIONAR EFECTOS TRAS LA DETONACIÓN
import { Explosion } from "./Explosion";

export class Bomb {
    // FUNCIÓN QUE SIRVE PARA CREAR LA INSTANCIA DE LA BOMBA Y PROGRAMAR SU ACTIVACIÓN
    constructor(scene, x, y, activationSpeed, explosionRange, player) {
        // REFERENCIA A LA ESCENA
        this.scene = scene;
        // POSICIÓN GRID
        this.x = x;
        this.y = y;
        // VELOCIDAD DE ACTIVACIÓN 
        this.activationSpeed = activationSpeed;
        // RANGO DE LA EXPLOSIÓN
        this.explosionRange = explosionRange;
        // REFERENCIA AL JUGADOR
        this.player = player;

        // POSICIÓN DE GRID A POSICIÓN DEL MUNDO
        this.worldPos = this.scene.mapManager.fromGridToPos(this.x, this.y);
        // SPRITE FÍSICO (COLLIDER) DE LA BOMBA EN LA ESCENA
        this.sprite = scene.physics.add.sprite(this.worldPos.x, this.worldPos.y, 'bomb1');
        // SE HACE LA BOMBA INMÓVIL (NO LA MUEVA LA FÍSICA)
        this.sprite.setImmovable(true);
        // SE REPRODUCE ANIMACIÓN DE PREPARACIÓN
        this.sprite.anims.play('prepBomb');

        // SE AÑADE COLISIÓN ENTRE LA BOMBA Y TODOS LOS JUGADORES
        this.scene.players.forEach(p => {
            this.scene.physics.add.collider(p.sprite, this.sprite);
        });

        // SE ELIMINA LA COLISIÓN ENTRE LA BOMBA Y EL JUGADOR QUE LA COLÓCO (PARA PERMITIR SALIR)
        this.scene.physics.world.removeCollider(
            this.scene.physics.add.collider(this.player.sprite, this.sprite)
        );

        // SE COMPRUEBA CUANDO EL JUGADOR SALE DE LA CELDA DE LA BOMBA PARA REACTIVAR COLISIÓN
        const checkExit = this.scene.time.addEvent({
            delay: 100, // TIEMPO ENTRE COMPROBACIONES
            callback: () => {
                // CONVIERTE LA POSICIÓN DEL MUNDO DEL JUGADOR A POSICIÓN EN EL GRID
                const gridPosPlayer = this.scene.mapManager.fromPosToGrid(this.player.sprite.x, this.player.sprite.y);
                // CONVIERTE LA POSICIÓN DEL MUNDO DE LA BOMBA A POSICIÓN EN EL GRID
                const gridPosBomb = this.scene.mapManager.fromPosToGrid(this.worldPos.x, this.worldPos.y);

                // SI EL JUGADOR YA NO ESTÁ EN LA MISMA CELDA QUE LA BOMBA
                if (gridPosPlayer.x !== gridPosBomb.x || gridPosPlayer.y !== gridPosBomb.y) {
                    // SE REACTIVA LA COLISIÓN ENTRE JUGADOR Y BOMBA
                    this.scene.physics.add.collider(this.player.sprite, this.sprite);
                    // SE ELIMINA EL EVENTO DE CHEQUEO 
                    checkExit.remove();
                }
            },
            loop: true // SE REPITE HASTA VOLVER A MOVERSE
        });

        // ARRAY DE DELAYS SEGÚN VELOCIDAD DE ACTIVACIÓN Y VALOR POR DEFECTO SI FUERA INVÁLIDO
        const delay = [4000, 3500, 3000, 2500][activationSpeed - 1] || 4000;

        //  EXPLOSIÓN TRAS EL DELAY CORRESPONDIENTE
        scene.time.delayedCall(delay, () => {
            // ANIMACIÓN DE EXPLOSIÓN
            this.sprite.anims.play('explosionBomb');
            // SONIDO DE EXPLOSIÓN
            this.scene.sound.play('explosion');
            // AL TERMINAR LA ANIMACIÓN SE DESTRUYE LA BOMBA Y CREA ACTUALIZA EL CONTADOR DE BOMBAS
            this.sprite.once('animationcomplete', () => {
                this.sprite.destroy();               // SE DESTRUYE EL SPRITE DE LA BOMBA
                this.player.bombsPlaced--;           // SE ACTUALIZA EL CONTADOR DE BOMBAS

                // SE CREA UNA NUEVA INSTANCIA DE EXPLOSION 
                new Explosion(this.scene, this.worldPos.x, this.worldPos.y, this.explosionRange, this.player);
            });
        });
    }
}