export class Explosion {
    constructor(scene, x, y, range, player) {
        this.scene = scene;
        this.player = player; // jugador que puso la bomba

        this.createStain(x, y); // centro
        this.propagate(x, y, range, 1, 0);   // derecha
        this.propagate(x, y, range, -1, 0);  // izquierda
        this.propagate(x, y, range, 0, 1);   // abajo
        this.propagate(x, y, range, 0, -1);  // arriba
    }

    createStain(x, y) {
        const randomValue = Math.floor(Math.random() * 3);
        switch(randomValue){
            case 0:
                var textureKey = this.player.id === 'player1' ? 'stain1' : 'decolored_stain1';
                break;
            case 1:
                var textureKey = this.player.id === 'player1' ? 'stain2' : 'decolored_stain2';
                break;
            case 2:
                var textureKey = this.player.id === 'player1' ? 'stain3' : 'decolored_stain3';
                break;
        }
        const stain = this.scene.physics.add.sprite(x, y, textureKey);

        this.scene.players.forEach(player => {
            this.scene.physics.add.overlap(player.sprite, stain, () => {
                player.takeDamage();
            });
        });

        this.scene.time.delayedCall(2000, () => {
            stain.destroy();
        });
    }

    propagate(x, y, range, dx, dy) {
    for (let i = 1; i <= range; i++) {
        const gridPos = this.scene.mapManager.fromPosToGrid(
            x + dx * i * this.scene.mapManager.baseTileSize,
            y + dy * i * this.scene.mapManager.baseTileSize
        );
        const worldPos = this.scene.mapManager.fromGridToPos(gridPos.x, gridPos.y);

        // 🔹 Comprobar indestructibles
        const indestructible = this.scene.physics.overlapRect(worldPos.x, worldPos.y, 1, 1, true);
        if (indestructible.some(obj => this.scene.mapManager.exteriorWalls.contains(obj) || this.scene.mapManager.interiorWalls.contains(obj))) {
            break; // cortar propagación
        }

        // 🔹 Comprobar destructibles
        const wall = this.scene.mapManager.destructibleWalls.find(w => w.sprite.x === worldPos.x && w.sprite.y === worldPos.y);
        if (wall) {
            wall.destroy();
            break; // cortar propagación después de destruir
        }

        // 🔹 Crear mancha
        this.createStain(worldPos.x, worldPos.y);
    }
}

}
