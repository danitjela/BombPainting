import { DestructibleWall } from "./DestructibleWall";

export class MapManager{
    constructor(scene){
        this.scene = scene;

        this.baseTileSize = 64;
        this.baseWidth = 16;
        this.baseHeight = 12;

        this.ground = Array.from({ length: this.baseWidth }, () => []);
        this.exteriorWalls = this.scene.physics.add.staticGroup();
        this.interiorWalls = this.scene.physics.add.staticGroup();;
        this.destructibleWalls = [];


    }

    createMap(){
        this.createGround();
        this.createWalls();  
        this.createInnerWalls();
        this.createDestructibleWalls();
    }

    createGround() {
        for (let x = 0; x < this.baseWidth; x++) {
            for (let y = 0; y < this.baseHeight; y++) {
                const textureKey = (x + y) % 2 === 0 ? 'floor1' : 'floor2';

                const tile = this.scene.add.image(
                    x * this.baseTileSize + this.baseTileSize / 2,
                    y * this.baseTileSize + this.baseTileSize / 2,
                    textureKey
                );
                tile.setDisplaySize(this.baseTileSize, this.baseTileSize);

                this.ground[x][y] = tile;
            }   
        }
    }


    //Get del tile del suelo, para poder cambiar el color
    getTile(x, y) {
        if (y >= 0 && y < this.baseHeight && x >= 0 && x < this.baseWidth) {
            return this.ground[y][x];
        }
        return null;
    }

    createWalls(){
        //Esquinas
        this.addWall(0, 0, 'LTCorner', this.exteriorWalls);
        this.addWall(15, 0, 'RTCorner', this.exteriorWalls);
        this.addWall(0, 11, 'LBCorner', this.exteriorWalls);
        this.addWall(15, 11, 'RBCorner', this.exteriorWalls);

        //Bordes Superior e inferior
        for(let i = 1; i < this.baseWidth - 1; i++){
            if(i==3||i==7||i==11){
                this.addWall(i, 0, 'TColumn1', this.exteriorWalls);
                this.addWall(i, 11, 'BColumn1', this.exteriorWalls);
                i++;
                this.addWall(i, 0, 'TColumn2', this.exteriorWalls);
                this.addWall(i, 11, 'BColumn2', this.exteriorWalls);
            }else{
                this.addWall(i, 0, 'TBorder', this.exteriorWalls);
                this.addWall(i, 11, 'BBorder', this.exteriorWalls);
            }
        }

        //Bordes Izquierda y derecha
        for(let i = 1; i < this.baseHeight - 1; i++){
            if(i==2||i==5||i==8){
                this.addWall(0, i, 'LColumn1', this.exteriorWalls);
                this.addWall(15, i, 'RColumn1', this.exteriorWalls);
                i++;
                this.addWall(0, i, 'LColumn2', this.exteriorWalls);
                this.addWall(15, i, 'RColumn2', this.exteriorWalls);
            }else{
                this.addWall(0, i, 'LBorder', this.exteriorWalls);
                this.addWall(15, i, 'RBorder', this.exteriorWalls);
            }
        }
    }

    createInnerWalls(){
        //Bloques individuales
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

        //Filas de 2
        this.addWall(7,2, 'Bush2', this.interiorWalls);
        this.addWall(8,2, 'Bush3', this.interiorWalls);
        this.addWall(7,9, 'Bush2', this.interiorWalls);
        this.addWall(8,9, 'Bush3', this.interiorWalls);

        //Bloques de 3
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

        //Grupos de 4
        this.addWall(3,5, 'Bush11', this.interiorWalls);
        this.addWall(4,5, 'Bush12', this.interiorWalls);
        this.addWall(11,5, 'Bush11', this.interiorWalls);
        this.addWall(12,5, 'Bush12', this.interiorWalls);
        this.addWall(3,6, 'Bush18', this.interiorWalls);
        this.addWall(4,6, 'Bush19', this.interiorWalls);
        this.addWall(11,6, 'Bush18', this.interiorWalls);
        this.addWall(12,6, 'Bush19', this.interiorWalls);
    }

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

    //Método para crear los muros irrompibles de forma más sencilla
    addWall(x, y, textureKey, list) {
        const wall = list.create(
            x * this.baseTileSize + this.baseTileSize / 2,
            y * this.baseTileSize + this.baseTileSize / 2,
            textureKey
        );
        wall.setDisplaySize(this.baseTileSize, this.baseTileSize);
        wall.setImmovable(true);
        wall.refreshBody();
    }

    addDestructibleWall(x, y){
        const posX = x * this.baseTileSize + this.baseTileSize / 2;
        const posY = y * this.baseTileSize + this.baseTileSize / 2;
        const wall = new DestructibleWall(this.scene, posX, posY);
        this.destructibleWalls.push(wall);
    }

    fromGridToPos(x, y){
        const worldX = x * this.baseTileSize + this.baseTileSize / 2;
        const worldY = y * this.baseTileSize + this.baseTileSize / 2;
        return { x: worldX, y: worldY };
    }

    fromPosToGrid(x, y) {
        const gridX = Math.floor(x / this.baseTileSize);
        const gridY = Math.floor(y / this.baseTileSize);
        return { x: gridX, y: gridY };
    }
}