export class MapManager{
    constructor(scene){
        this.scene = scene;

        this.baseTileSize = 64;
        this.baseWidth = 16;
        this.baseHeight = 12;

        this.ground = Array.from({ length: this.baseWidth }, () => []);
        this.exteriorWalls = this.scene.physics.add.staticGroup();
        this.interiorWalls = [];
        this.destructibleWalls = [];


    }

    createMap(){
        this.createGround();
        this.createWalls();  
        
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
        this.addWall(0, 0, 'LTCorner');
        this.addWall(15, 0, 'RTCorner');
        this.addWall(0, 11, 'LBCorner');
        this.addWall(15, 11, 'RBCorner');

        //Bordes Superior e inferior
        for(let i = 1; i < this.baseWidth - 1; i++){
            if(i==3||i==7||i==11){
                this.addWall(i, 0, 'TColumn1');
                this.addWall(i, 11, 'BColumn1');
                i++;
                this.addWall(i, 0, 'TColumn2');
                this.addWall(i, 11, 'BColumn2');
            }else{
                this.addWall(i, 0, 'TBorder');
                this.addWall(i, 11, 'BBorder');
            }
        }

        //Bordes Izquierda y derecha
        for(let i = 1; i < this.baseHeight - 1; i++){
            if(i==2||i==5||i==8){
                this.addWall(0, i, 'LColumn1');
                this.addWall(15, i, 'RColumn1');
                i++;
                this.addWall(0, i, 'LColumn2');
                this.addWall(15, i, 'RColumn2');
            }else{
                this.addWall(0, i, 'LBorder');
                this.addWall(15, i, 'RBorder');
            }
        }
    }

    //Método para crear los bordes de forma más sencilla
    addWall(x, y, textureKey) {
    const wall = this.exteriorWalls.create(
        x * this.baseTileSize + this.baseTileSize / 2,
        y * this.baseTileSize + this.baseTileSize / 2,
        textureKey
    );
    wall.setDisplaySize(this.baseTileSize, this.baseTileSize);
    wall.setImmovable(true);
    wall.refreshBody();
    }

    fromGridToPos(x, y){
        const worldX = x * this.baseTileSize + this.baseTileSize / 2;
        const worldY = y * this.baseTileSize + this.baseTileSize / 2;
        return { x: worldX, y: worldY };
    }
}