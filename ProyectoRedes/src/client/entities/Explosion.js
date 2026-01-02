// EXPLOSION: GESTIONA LA CREACIÓN DE MANCHAS Y LA PROPAGACIÓN DE LA EXPLOSIÓN EN EL MAPA
export class Explosion {
    // FUNCIÓN QUE SIRVE PARA CREAR LA INSTANCIA DE LA EXPLOSIÓN Y LANZAR LA PROPAGACIÓN
    constructor(scene, x, y, range, player) {
        // ESCENA DONDE OCURRE
        this.scene = scene;
        // REFERENCIA AL JUGADOR 
        this.player = player;

        // MANCHA EN LA POSICIÓN INICIAL
        this.createStain(x, y);
        // PROPAGACIÓN HACIA DERECHA
        this.propagate(x, y, range, 1, 0);
        // PROPAGACIÓN HACIA IZQUIERDA
        this.propagate(x, y, range, -1, 0);
        // PROPAGACIÓN HACIA ABAJO
        this.propagate(x, y, range, 0, 1);
        // PROPAGACIÓN HACIA ARRIBA
        this.propagate(x, y, range, 0, -1);
    }

    // FUNCIÓN QUE SIRVE PARA CREAR UNA MANCHA VISUAL EN UNA POSICIÓN Y APLICAR EFECTOS
    createStain(x, y) {
        // VALOR ALEATORIO PARA ELEGIR TEXTURA
        const randomValue = Math.floor(Math.random() * 3);

        // SE HACE LA ASIGNACIÓN DE KEY DE TEXTURA SEGÚN VALOR ALEATORIO Y JUGADOR
        let textureKey;
        switch (randomValue) {
            case 0:
                textureKey = this.player.id === 'player1' ? 'stain1' : 'decolored_stain1';
                break;
            case 1:
                textureKey = this.player.id === 'player1' ? 'stain2' : 'decolored_stain2';
                break;
            case 2:
                textureKey = this.player.id === 'player1' ? 'stain3' : 'decolored_stain3';
                break;
        }

        // SE CREA EL COLLIDER (SPRITE FÍSICO) DE LA MANCHA EN LA ESCENA
        const stain = this.scene.physics.add.sprite(x, y, textureKey);

        // SE AÑADE SOLAPAMIENTO ENTRE CADA JUGADOR Y LA MANCHA PARA CAUSAR DAÑO
        this.scene.players.forEach(player => {
            this.scene.physics.add.overlap(player.sprite, stain, () => {
                if(this.scene.mode === 'local'){
                    player.takeDamage(); // SE LLAMA AL MÉTODO DE DAÑO DEL JUGADOR
                }
            });
        });

        // SE DESTRUYE LA MANCHA TRAS 2 SEGUNDOS
        this.scene.time.delayedCall(2000, () => {
            stain.destroy(); // SE DESTRUYE EL SPRITE
        });

        // SE HACE CONVIERTE A POSICIÓN EN EL GRID
        const gridPos = this.scene.mapManager.fromPosToGrid(x, y);

        // CAMBIO DE TEXTURAS DEL SUELO SEGÚN EL JUGADOR QUE LANZÓ LA BOMBA
        if (this.player.id == 'player1') {
            // SI EL JUGADOR 1, SE DESACTIVA LA VERSIÓN "G" DEL SUELO SI ESTÁ ACTIVA
            if (this.scene.mapManager.ground[gridPos.x][gridPos.y].texture.key === 'floor1G') {
                this.scene.mapManager.ground[gridPos.x][gridPos.y].setTexture('floor1'); // ACTUALIZA: TEXTURA A floor1
            } else if (this.scene.mapManager.ground[gridPos.x][gridPos.y].texture.key === 'floor2G') {
                this.scene.mapManager.ground[gridPos.x][gridPos.y].setTexture('floor2'); // ACTUALIZA: TEXTURA A floor2
            }
        } else {
            // SI NO ES EL JUGADOR 1, SE ACTIVA LA VERSIÓN "G" DEL SUELO SI ESTÁ EN SU ESTADO NORMAL
            if (this.scene.mapManager.ground[gridPos.x][gridPos.y].texture.key === 'floor1') {
                this.scene.mapManager.ground[gridPos.x][gridPos.y].setTexture('floor1G'); // ACTUALIZA: TEXTURA A floor1G
            } else if (this.scene.mapManager.ground[gridPos.x][gridPos.y].texture.key === 'floor2') {
                this.scene.mapManager.ground[gridPos.x][gridPos.y].setTexture('floor2G'); // ACTUALIZA: TEXTURA A floor2G
            }
        }
    }

    // FUNCIÓN QUE SIRVE PARA PROPAGAR LA EXPLOSIÓN EN UNA DIRECCIÓN (DX,DY) HASTA UN RANGO
    propagate(x, y, range, dx, dy) {
        // BUCLE POR CADA PASO HASTA EL RANGO
        for (let i = 1; i <= range; i++) {
            // SE CÁLCULA LA POSICIÓN EN EL GRID A PARTIR DE POSICIÓN DEL MUNDO Y DESPLAZAMIENTO
            const gridPos = this.scene.mapManager.fromPosToGrid(
                x + dx * i * this.scene.mapManager.baseTileSize,
                y + dy * i * this.scene.mapManager.baseTileSize
            );
            // SE CONVIERTE DE POSICIÓN EN EL GRID A POSICIÓN DEL MUNDO
            const worldPos = this.scene.mapManager.fromGridToPos(gridPos.x, gridPos.y);

            // SE COMPRUEBA SI HAY PARED INDESTRUCTIBLE EN ESA POSICIÓN
            const isIndestructible = this.scene.mapManager.exteriorWalls.getChildren().some(wall =>
                wall.x === worldPos.x && wall.y === worldPos.y
            ) || this.scene.mapManager.interiorWalls.getChildren().some(wall =>
                wall.x === worldPos.x && wall.y === worldPos.y
            );

            // SI HAY PARED INDESTRUCTIBLE, SE ROMPE LA PROPAGACIÓN
            if (isIndestructible) {
                break; // SE SALE DEL BUCLE
            }

            // BÚSQUEDA DE PARED DESTRUCTIBLE EN LA POSICIÓN
            const wall = this.scene.mapManager.destructibleWalls.find(w => w.sprite.x === worldPos.x && w.sprite.y === worldPos.y);
            if (wall) {
                wall.destroy(); // SE DESTRUYE LA PARED
                break; // SE DETIENE LA PROPAGACIÓN AL DESTRUIR UNA PARED
            }

            // SI NO SE HA CHOCADO CON UNA PARED INDESTRUCTUBLE O INDESTRUCTIBLE,
            // SE CREA UNA MANCHA EN LA POSICIÓN ACTUAL DE LA PROPAGACIÓN
            this.createStain(worldPos.x, worldPos.y);
        }
    }
}