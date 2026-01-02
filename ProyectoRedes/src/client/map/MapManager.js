// IMPORTA CLASE DestructibleWall PARA CREAR MUROS DESTRUCTIBLES
import { DestructibleWall } from "./DestructibleWall";

// FUNCIÓN QUE SIRVE PARA GESTIONAR LA CREACIÓN Y CONVERSIÓN DE ELEMENTOS DEL MAPA
export class MapManager{
    // FUNCIÓN QUE SIRVE PARA INICIALIZAR EL MAP MANAGER Y SUS PARÁMETROS BÁSICOS
    constructor(scene){
        // ASIGNA REFERENCIA A LA ESCENA
        this.scene = scene;

        // CONFIGURACIÓN BASE DE TILES
        this.baseTileSize = 64;    // TAMAÑO BASE DE CADA TILE
        this.baseWidth = 16;       // ANCHO EN TILES
        this.baseHeight = 12;      // ALTO EN TILES

        // ARRAY 2D DEL SUELO
        this.ground = Array.from({ length: this.baseWidth }, () => []);
        // GRUPO ESTÁTICO PARA MUROS EXTERIORES
        this.exteriorWalls = this.scene.physics.add.staticGroup();
        // GRUPO ESTÁTICO PARA MUROS INTERIORES
        this.interiorWalls = this.scene.physics.add.staticGroup();
        // ARRAY DE MUROS DESTRUCTIBLES
        this.destructibleWalls = [];
    }

    // FUNCIÓN QUE SIRVE PARA CREAR TODO EL MAPA LLAMANDO A LOS SUBMÉTODOS
    createMap(){
        // SE CREA EL SUELO
        this.createGround();
        // SE CREAN LOS MUROS EXTERIORES
        this.createWalls();  
        // SE CREAN LOS MUROS INTERNOS
        this.createInnerWalls();
        // SE CREAN LOS MUROS DESTRUCTIBLES
        this.createDestructibleWalls();
    }

    // FUNCIÓN QUE SIRVE PARA GENERAR LOS TILES DEL SUELO EN EL GRID
    createGround() {
        // ITERA POSICIONES X
        for (let x = 0; x < this.baseWidth; x++) {
            // ITERA POSICIONES Y
            for (let y = 0; y < this.baseHeight; y++) {
                // SELECCIONA TEXTURA SEGÚN PATRÓN DE AJEDREZ
                const textureKey = (x + y) % 2 === 0 ? 'floor1' : 'floor2';

                // CREA IMAGEN EN POSICIÓN DEL MUNDO CENTRADA EN EL TILE
                const tile = this.scene.add.image(
                    x * this.baseTileSize + this.baseTileSize / 2,
                    y * this.baseTileSize + this.baseTileSize / 2,
                    textureKey
                );
                // AJUSTA TAMAÑO DE VISUALIZACIÓN AL TILE
                tile.setDisplaySize(this.baseTileSize, this.baseTileSize);

                // ALMACENA EN ARRAY DE SUELO
                this.ground[x][y] = tile;
            }   
        }
    }

    // FUNCIÓN QUE SIRVE PARA OBTENER UN TILE DEL SUELO
    getTile(x, y) {
        // COMPRUEBA LÍMITES DE LA GRILLA
        if (y >= 0 && y < this.baseHeight && x >= 0 && x < this.baseWidth) {
            // RETORNA EL TILE CORRESPONDIENTE
            return this.ground[y][x];
        }
        // RETORNO NULO SI FUERA DE RANGO
        return null;
    }

    // FUNCIÓN QUE SIRVE PARA CREAR LOS MUROS EXTERIORES
    createWalls(){
        // ESQUINAS
        this.addWall(0, 0, 'LTCorner', this.exteriorWalls);
        this.addWall(15, 0, 'RTCorner', this.exteriorWalls);
        this.addWall(0, 11, 'LBCorner', this.exteriorWalls);
        this.addWall(15, 11, 'RBCorner', this.exteriorWalls);

        // BORDES SUPERIOR E INFERIOR
        for(let i = 1; i < this.baseWidth - 1; i++){
            if(i==3||i==7||i==11){
                // CREA COLUMNAS ESPECIALES DE ARRIBA Y ABAJO (PARTE 1)
                this.addWall(i, 0, 'TColumn1', this.exteriorWalls);
                this.addWall(i, 11, 'BColumn1', this.exteriorWalls);
                i++;
                // CREA COLUMNAS ESPECIALES DE ARRIBA Y ABAJO (PARTE 2)
                this.addWall(i, 0, 'TColumn2', this.exteriorWalls);
                this.addWall(i, 11, 'BColumn2', this.exteriorWalls);
            }else{
                // CREA BORDE NORMAL SUPERIOR E INFERIOR
                this.addWall(i, 0, 'TBorder', this.exteriorWalls);
                this.addWall(i, 11, 'BBorder', this.exteriorWalls);
            }
        }

        // BORDES IZQUIERDA Y DERECHA
        for(let i = 1; i < this.baseHeight - 1; i++){
            if(i==2||i==5||i==8){
                // CREA COLUMNAS LATERALES ESPECIALES (PARTE 1)
                this.addWall(0, i, 'LColumn1', this.exteriorWalls);
                this.addWall(15, i, 'RColumn1', this.exteriorWalls);
                i++;
                // CREA COLUMNAS LATERALES ESPECIALES (PARTE 2)
                this.addWall(0, i, 'LColumn2', this.exteriorWalls);
                this.addWall(15, i, 'RColumn2', this.exteriorWalls);
            }else{
                // CREA BORDE LATERAL NORMAL
                this.addWall(0, i, 'LBorder', this.exteriorWalls);
                this.addWall(15, i, 'RBorder', this.exteriorWalls);
            }
        }
    }

    // FUNCIÓN QUE SIRVE PARA COLOCAR MUROS INTERIORES PREDEFINIDOS (BLOQUES Y GRUPOS)
    createInnerWalls(){
        // BLOQUES INDIVIDUALES
        this.addWall(2,2, 'Bush22', this.interiorWalls);
        this.addWall(13,2, 'Bush22', this.interiorWalls);
        this.addWall(1,4, 'Bush22', this.interiorWalls);
        this.addWall(6,4, 'Bush22', this.interiorWalls);
        this.addWall(9,4, 'Bush22', this.interiorWalls);
        this.addWall(14,4, 'Bush22', this.interiorWalls);
        this.addWall(1,7, 'Bush22', this.interiorWalls);
        this.addWall(6,7, 'Bush22', this.interiorWalls);
        this.addWall(9,7, 'Bush22', this.interiorWalls);
        this.addWall(14,7, 'Bush22', this.interiorWalls);
        this.addWall(2,9, 'Bush22', this.interiorWalls);
        this.addWall(13,9, 'Bush22', this.interiorWalls);

        // FILAS DE 2
        this.addWall(7,2, 'Bush2', this.interiorWalls);
        this.addWall(8,2, 'Bush3', this.interiorWalls);
        this.addWall(7,9, 'Bush2', this.interiorWalls);
        this.addWall(8,9, 'Bush3', this.interiorWalls);

        // BLOQUES DE 3
        this.addWall(4,1, 'Bush2', this.interiorWalls);
        this.addWall(5,1, 'Bush12', this.interiorWalls);
        this.addWall(11,1, 'Bush3', this.interiorWalls);
        this.addWall(10,1, 'Bush11', this.interiorWalls);
        this.addWall(5,2, 'Bush16', this.interiorWalls);
        this.addWall(10,2, 'Bush15', this.interiorWalls);

        this.addWall(5,9, 'Bush9', this.interiorWalls);
        this.addWall(10,9, 'Bush8', this.interiorWalls);
        this.addWall(4,10, 'Bush10', this.interiorWalls);
        this.addWall(5,10, 'Bush19', this.interiorWalls);
        this.addWall(11,10, 'Bush17', this.interiorWalls);
        this.addWall(10,10, 'Bush18', this.interiorWalls);

        // GRUPOS DE 4
        this.addWall(3,5, 'Bush11', this.interiorWalls);
        this.addWall(4,5, 'Bush12', this.interiorWalls);
        this.addWall(11,5, 'Bush11', this.interiorWalls);
        this.addWall(12,5, 'Bush12', this.interiorWalls);
        this.addWall(3,6, 'Bush18', this.interiorWalls);
        this.addWall(4,6, 'Bush19', this.interiorWalls);
        this.addWall(11,6, 'Bush18', this.interiorWalls);
        this.addWall(12,6, 'Bush19', this.interiorWalls);
    }

    // FUNCIÓN QUE SIRVE PARA GENERAR LA COLECCIÓN DE MUROS DESTRUCTIBLES EN POSICIONES PREDEFINIDAS
    createDestructibleWalls(){
        this.addDestructibleWall(1,3);
        this.addDestructibleWall(1,5);
        this.addDestructibleWall(1,9);
        this.addDestructibleWall(2,3);
        this.addDestructibleWall(2,7);
        this.addDestructibleWall(3,1);
        this.addDestructibleWall(3,4);
        this.addDestructibleWall(3,10);
        this.addDestructibleWall(4,3);
        this.addDestructibleWall(4,8);
        this.addDestructibleWall(5,4);
        this.addDestructibleWall(5,7);
        this.addDestructibleWall(6,2);
        this.addDestructibleWall(6,5);
        this.addDestructibleWall(6,8);
        this.addDestructibleWall(7,6);
        this.addDestructibleWall(7,10);
        this.addDestructibleWall(8,1);
        this.addDestructibleWall(8,5);
        this.addDestructibleWall(8,7);
        this.addDestructibleWall(8,8);
        this.addDestructibleWall(9,3);
        this.addDestructibleWall(9,9);
        this.addDestructibleWall(10,4);
        this.addDestructibleWall(10,6);
        this.addDestructibleWall(11,3);
        this.addDestructibleWall(11,8);
        this.addDestructibleWall(12,1);
        this.addDestructibleWall(12,4);
        this.addDestructibleWall(12,10);
        this.addDestructibleWall(13,7);
        this.addDestructibleWall(14,3);
        this.addDestructibleWall(14,5);
        this.addDestructibleWall(14,8);
    }

    // FUNCIÓN QUE SIRVE PARA AÑADIR UN MURO INROMPIBLE DE FORMA SENCILLA (USADA PARA EXTERIOR/INTERIOR)
    addWall(x, y, textureKey, list) {
        // CREA SPRITE EN EL GRUPO PASADO
        const wall = list.create(
            x * this.baseTileSize + this.baseTileSize / 2,
            y * this.baseTileSize + this.baseTileSize / 2,
            textureKey
        );
        // AJUSTA TAMAÑO DEL SPRITE AL TILE
        wall.setDisplaySize(this.baseTileSize, this.baseTileSize);
        // HACE EL MURO INMOVIBLE
        wall.setImmovable(true);
        // REFRESCA EL CUERPO FÍSICO TRAS CAMBIOS
        wall.refreshBody();
    }

    // FUNCIÓN QUE SIRVE PARA AÑADIR UN MURO DESTRUCTIBLE Y REGISTRARLO EN EL MANAGER
    addDestructibleWall(x, y){
        // CONVIERTE COORDENADAS GRID A POSICIÓN MUNDIAL CENTRADA
        const posX = x * this.baseTileSize + this.baseTileSize / 2;
        const posY = y * this.baseTileSize + this.baseTileSize / 2;
        // CREA INSTANCIA DE DESTRUCTIBLE WALL EN ESA POSICIÓN
        const wall = new DestructibleWall(this.scene, posX, posY);
        // AÑADE AL ARRAY DE MUROS DESTRUCTIBLES
        this.destructibleWalls.push(wall);
    }

    // FUNCIÓN QUE SIRVE PARA CONVERTIR COORDENADAS DEL GRID A POSICIÓN DEL MUNDO
    fromGridToPos(x, y){
        // CALCULA X DEL MUNDO
        const worldX = x * this.baseTileSize + this.baseTileSize / 2;
        // CALCULA Y DEL MUNDO
        const worldY = y * this.baseTileSize + this.baseTileSize / 2;
        // RETORNA POSICIÓN OBJETO 
        return { x: worldX, y: worldY };
    }

    // FUNCIÓN QUE SIRVE PARA CONVERTIR POSICIÓN DEL MUNDO A COORDENADAS DEL GRID
    fromPosToGrid(x, y) {
        // CALCULA X EN GRID
        const gridX = Math.floor(x / this.baseTileSize);
        // CALCULA Y EN GRID
        const gridY = Math.floor(y / this.baseTileSize);
        // RETORNA COORDENADAS OBJETO 
        return { x: gridX, y: gridY };
    }

    destroyDestructibleWall(gridX, gridY) { 
        const wall = this.destructibleWalls.find(w => w.gridX === gridX && w.gridY === gridY); 
        if (!wall) return; 
        wall.sprite.destroy(); 
        this.destructibleWalls = this.destructibleWalls.filter(w => w !== wall); 
    }
}