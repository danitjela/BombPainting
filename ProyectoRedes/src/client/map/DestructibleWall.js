// IMPORTA CLASE PowerUp PARA GENERAR RECOMPENSAS AL DESTRUIR MUROS
import { PowerUp } from "../entities/PowerUp";

// FUNCIÓN QUE SIRVE PARA GESTIONAR UN MURO DESTRUIBLE EN LA ESCENA
export class DestructibleWall{
    // FUNCIÓN QUE SIRVE PARA INICIALIZAR EL MURO Y CREAR SU SPRITE ESTÁTICO
    constructor(scene, x, y){
        // ASIGNA REFERENCIA A LA ESCENA
        this.scene = scene;
        // ASIGNA POSICIÓN X
        this.x = x;
        // ASIGNA POSICIÓN Y
        this.y = y;
        // CREA SPRITE ESTÁTICO EN LA ESCENA CON LA TEXTURA "Box"
        this.sprite = scene.physics.add.staticImage(x, y, "Box");
        // HACE EL SPRITE INMOVIBLE
        this.sprite.setImmovable(true);
        // ASIGNA METADATO TIPO PARA IDENTIFICARLO COMO DESTRUCTIBLE
        this.sprite.setData('type', 'destructible');
        // FLAG QUE INDICA SI EL MURO YA FUE DESTRUIDO
        this.isDestroyed = false;
    }

    // FUNCIÓN QUE SIRVE PARA DESTRUIR EL MURO Y GENERAR UN POWERUP ALEATORIAMENTE
    destroy() {
        // SI YA ESTÁ DESTRUIDO, SALE SIN HACER NADA
        if (this.isDestroyed) return;
        // MARCA COMO DESTRUIDO
        this.isDestroyed = true;

        // DESTRUYE EL SPRITE DEL MURO
        this.sprite.destroy();

        // FILTRA EL MURO ELIMINADO DEL ARRAY DE MUROS DESTRUCTIBLES DEL MAPA
        this.scene.mapManager.destructibleWalls =
            this.scene.mapManager.destructibleWalls.filter(w => w !== this);

        // PROBABILIDAD DEL 50% DE GENERAR UN POWERUP
        if (Math.random() < 0.5) {
            // VALOR ALEATORIO ENTRE 0 Y 3 PARA ELEGIR TIPO DE POWERUP
            const randomValue = Math.floor(Math.random() * 4);
            switch(randomValue){
                case 0:
                    // CREA POWERUP DE MÁS BOMBAS EN LA POSICIÓN DEL MURO
                    new PowerUp(this.scene, this.x, this.y, 'moreBombs');
                    break;
                case 1:
                    // CREA POWERUP DE EXPLOSIÓN MÁS GRANDE
                    new PowerUp(this.scene, this.x, this.y, 'biggerExplosion');
                    break;
                case 2:
                    // CREA POWERUP DE ACTIVACIÓN DE BOMBAS MÁS RÁPIDA
                    new PowerUp(this.scene, this.x, this.y, 'fasterExplosion');
                    break;
                case 3:
                    // CREA POWERUP DE VIDA
                    new PowerUp(this.scene, this.x, this.y, 'moreLife');
                    break;
            }
        }
    }
}