/**
 * Game Room service - manages active game rooms and in-game logic
 */
export function createGameRoomService() {
  // CLASE QUE GESTIONA TODA LA JUGABILIDAD DEL MODO ONLINE
  const rooms = new Map();
  let nextRoomId = 1;

  // VARIABLES PARA SABER QUE TIPO DE TILE CONTIENE EL MAPA LÓGICO DEFINIDO ABAJO
  const TILE_EMPTY = 0; 
  const TILE_SOLID = 1; 
  const TILE_BREAKABLE = 2;

  // COLLIDER PARA EL PERSONAJE
  const COLLIDER_OFFSET_Y = 24; 
  const COLLIDER_HALF_HEIGHT = 8;

  // TAMAÑO DE CADA TILE DEL MAPA
  const tileSize = 64;

  // MAPA LÓGICO QUE GUARDA SI UN TILE ESTÁ VACÍO, SI ES UN BLOQUE IRROMPIBLE, O SI ES UN BLOQUE DESTRUÍBLE
  const logicMap = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // y=0 
    [1,0,0,2,1,1,0,0,2,0,1,1,2,0,0,1], // y=1 
    [1,0,1,0,0,1,2,1,1,0,1,0,0,1,0,1], // y=2 
    [1,2,2,0,2,0,0,0,0,2,0,2,0,0,2,1], // y=3 
    [1,1,0,2,0,2,1,0,0,1,2,0,2,0,1,1], // y=4 
    [1,2,0,1,1,0,2,0,2,0,0,1,1,0,2,1], // y=5 
    [1,0,0,1,1,0,0,2,0,0,2,1,1,0,0,1], // y=6 
    [1,1,2,0,0,2,1,0,2,1,0,0,0,2,1,1], // y=7 
    [1,0,0,0,2,0,2,0,2,0,0,2,0,0,2,1], // y=8 
    [1,2,1,0,0,1,0,1,1,2,1,0,0,1,0,1], // y=9 
    [1,0,0,2,1,1,0,2,0,0,1,1,2,0,0,1], // y=10 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], // y=11 
  ];

  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    // CADA ROOM GUARDA LA SIGUIENTE INFORMACIÓN
    const room = {
      id: roomId,
      logicMap: JSON.parse(JSON.stringify(logicMap)),
      active: true,
      bombs: [],
      powerups: [],
      activeExplosions: [],
      players: [
        {
          ws: player1Ws,
          id: 'player1',
          x: 1 * tileSize + tileSize / 2, 
          y: 1 * tileSize + tileSize / 2,
          name: 'paca',
          maxBombs: 1,
          bombsPlaced: 0,
          explosionRange: 1,
          activationSpeed: 1,
          lifes: 3,
          alive: true
        },
        {
          ws: player2Ws,
          id: 'player2',
          x: 14 * tileSize + tileSize / 2, 
          y: 10 * tileSize + tileSize / 2,
          name: 'acop',
          maxBombs: 1,
          bombsPlaced: 0,
          explosionRange: 1,
          activationSpeed: 1,
          lifes: 3,
          alive: true
        }
      ]
    };

    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    rooms.set(roomId, room);
    return room;
  }

  // INFORMACIÓN QUE SE LE MANDA AL CLIENTE CUANDO EMPIEZA LA PARTIDA PARA QUE PUEDA RENDERIZAR TODO
  function sendGameInit(room) {
    const payload = {
      type: 'gameInit',
      players: room.players.map(p => ({
        id: p.id,
        x: p.x,
        y: p.y,
        name: p.name
      }))
    };

    room.players.forEach(p => {
      if (p.ws.readyState === 1) {
        p.ws.send(JSON.stringify(payload));
      }
    });
  }

  // GESTIÓN DE DESCONEXIÓN
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    room.active = false;

    room.players.forEach(p => {
      if (p.ws !== ws && p.ws.readyState === 1) {
        p.ws.send(JSON.stringify({ type: 'playerDisconnected' }));
      }
    });

    rooms.delete(roomId);
  }

  // FUNCIÓN QUE GESTIONA EL MOVIMIENTO DE LOS JUGADORES
  function handlePlayerMove(ws, dir) {
    const roomId = ws.roomId;
    // VELOCIDAD DE LOS PERSONAJES
    const speed = 1.0;
    // VARIABLE AUXILIAR DE VELOCIDAD EN CADA COORDENADA
    let vx = 0, vy = 0;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // BUSCA AL JUGADOR QUE QUIERE MOVERSE
    const player = room.players.find(p => p.ws === ws);
    
    if (!player) return;
    // EN FUNCIÓN DE LA DIRECCIÓN, LE ASIGNA UNA VELOCIDAD
    if(dir === 'left') {vx = -speed}
    else if(dir === 'right') { vx = speed}
    else if(dir === 'up'){ vy = -speed}
    else if(dir === 'down'){vy = speed};

    // SE CALCULA SU NUEVA POSICIÓN
    const newX = player.x + vx; 
    const newY = player.y + vy; 
    // SE CALCULA SI LA NUEVA POSICIÓN ES VÁLIDA, ES DECIR SI HAY UN BLOQUE SÓLIDO O NO
    if (canMoveTo(room, newX, newY, dir)) { 
      player.x = newX; 
      player.y = newY; 
    }

    // MANDA LA DIRECCIÓN DEL JUGADOR PARA EL SPRITE
    if (dir == 'left' || dir == 'right' || dir == 'up' || dir == 'down') { 
      player.facing = dir; 
    }else{
      player.facing = null;
    }
  }

  // FUNCIÓN QUE GESTIONA CUANDO UN JUGADOR PONE UNA BOMBA
  function handleBombPlaced(ws) {
    const room = rooms.get(ws.roomId);
    if (!room) return;

    // OBTIENE EL JUGADOR QUE PONE LA BOMBA
    const player = room.players.find(p => p.ws === ws);
    if (!player || !player.alive) return;

    // SI EL JUGADOR INTENTA PONER MÁS BOMBAS DE LAS MÁXIMAS, NO HACE NADA
    if (player.bombsPlaced >= player.maxBombs) return;

    // OBTIENE LA POSICIÓN DE LA CASILLA DEL JUGADOR
    const gridX = Math.floor(player.x / tileSize);
    const gridY = Math.floor(player.y / tileSize);

    // SI YA HAY UNA BOMBA EN ESA CASILLA, NO HACE NADA
    if (room.bombs.some(b => b.x === gridX && b.y === gridY)) return;

    // AÑADE 1 A LA VARIABLE QUE CONTROLA LAS BOMBAS PUESTAS POR EL JUGADOR
    player.bombsPlaced++;

    // PARÁMETROS DE LA BOMBA
    const bomb = {
      x: gridX,
      y: gridY,
      owner: player.id,
      activationSpeed: player.activationSpeed,
      explosionRange: player.explosionRange,
      placedAt: Date.now()
    };

    // LA AÑADE AL ARRAY DE BOMBAS
    room.bombs.push(bomb);

    // AVISA A LOS JUGADORES QUE SE HA PUESTO UNA BOMBA EN ESA CASILLA PARA QUE LA RENDERICEN
    broadcast(room, {
      type: "bombSpawned",
      x: gridX,
      y: gridY,
      owner: player.id,
      activationSpeed: bomb.activationSpeed,
      explosionRange: bomb.explosionRange
    });
  }

  // INTERVALO PARA ACTUALIZAR LAS BOMBAS Y EL MOVIMIENTO DE LOS JUGADORES Y NO SOBRECARGAR AL SERVIDOR
  setInterval(() => {
    rooms.forEach(room => {
      if (room.active) {
        updateBombs(room);
        updateExplosions(room);
        broadcast(room, {
          type: "stateUpdate",
          players: room.players.map(p => ({
          id: p.id,
          x: p.x,
          y: p.y,
          facing: p.facing
          }))
        });
      }
    });
  }, 50);

  // FUNCIÓN QUE ACTUALIZA LAS BOMBAS
  function updateBombs(room) {
    const now = Date.now();

    // MIRA CUANTO TIEMPO LLEVA UNA BOMBA PUESTA, SI LLEVA MÁS DEL TIEMPO DE ACTIVACIÓN, LA EXPLOTA
    room.bombs = room.bombs.filter(bomb => {
      const delay = [4000, 3500, 3000, 2500][bomb.activationSpeed - 1] || 4000;

      if (now - bomb.placedAt >= delay) {
        explodeBomb(room, bomb);
        return false;
      }
      return true;
    });
  }

  // FUNCIÓN QUE EXPLOTA LA BOMBA
  function explodeBomb(room, bomb) {
    // OBTIENE AL JUGADOR QUE HA PUESTO LA BOMBA, Y SE LA RESTA DE LA VARIABLE DE BOMBAS PUESTAS
    const owner = room.players.find(p => p.id === bomb.owner);
    if (owner) {
      owner.bombsPlaced = Math.max(0, owner.bombsPlaced - 1);
    }
    // SE CREA UN ARRAY AUXILIAR DE LOS TILES EN LOS QUE VA A HABER MANCHAS
    const explosionTiles = [];

    // SE AÑADE LA CASILLA DE LA BOMBA
    explosionTiles.push({ x: bomb.x, y: bomb.y });

    // SE DEFINEN LAS DIRECCIONES DE EXPLOSIÓN
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    // PARA CADA DIRECCIÓN, SE EXPANDE EN FUNCIÓN DEL RANGO DE EXPLOSIÓN DE CADA JUGADOR
    for (const { dx, dy } of dirs) {
      for (let i = 1; i <= bomb.explosionRange; i++) {
        const x = bomb.x + dx * i;
        const y = bomb.y + dy * i;

        // OBTIENE LOS TILES DE CADA MANCHA
        const tile = room.logicMap[y][x];

        // SI EL TILE ES INDESTRUCTIBLE NO HACE NADA
        if (tile === 1) break;

        // SI SE PUEDE DESTRUIR, LO DESTRUYE, LO ELIMINA DEL MAPA LÓGICO Y AVISA A LOS JUGADORES PARA QUE ELIMINEN EL SPRITE
        if (tile === 2) {
          room.logicMap[y][x] = 0;
          broadcast(room, { 
            type: "blockDestroyed", 
            x, 
            y 
          });
          
          // LLAMA A LA FUNCIÓN QUE GESTIONA LA APARICIÓN DE POWERUPS
          maybeSpawnPowerup(room, x, y);
          break;
        }
        //AÑADE CADA TILE AL ARRAY DEEXPLOSION TILES
        explosionTiles.push({ x, y });
      }
    }
    // INFORMACIÓN NECESARIA PARA CALCULAR LOS TICKS DE DAÑO EN LOS JUGADORES
    room.activeExplosions.push({
      tiles: explosionTiles,
      createdAt: Date.now(),
      lastDamageTick: new Map()
    });

    // SE AVISA A LOS JUGADORES DE QUE LA BOMBA A EXPLOTADO, Y QUE TILES AFECTA
    broadcast(room, {
      type: "bombExploded",
      x: bomb.x,
      y: bomb.y,
      tiles: explosionTiles
    });
  }

  // FUNCIÓN QUE HACE QUE PUEDAN APARECER POWERUPS
  function maybeSpawnPowerup(room, x, y) {
    // 1 DE CADA 2 BLOQUES GENERARÁ UN POWERUP
    if (Math.random() < 0.5) {
      // SI SE GENERA UN POWERUP, GENERA UNO DE LOS 4 QUE HAY, Y LO AÑADE AL ARRAY DE POWERUPS
      const type = ["range", "speed", "bombs", "life"][Math.floor(Math.random() * 4)];
      room.powerups.push({ x, y, type });

      // SE AVISA A LOS JUGADORES DE QUE HA APARECIDO UN POWERUP PARA QUE LO RENDERICEN
      broadcast(room, {
        type: "powerupSpawned",
        x, y, powerupType: type
      });
    }
  }

  // FUNCIÓN QUE GESTIONA CUANDO UN JUGADOR COGE UN POWERUP
  function handlePowerupPickup(ws, x, y) {
    const room = rooms.get(ws.roomId);
    if (!room) return;

    // SE EL POWERUP QUE HA SIDO COGIDO
    const index = room.powerups.findIndex(p => p.x === x && p.y === y);
    if (index === -1) return;

    // SE ELIMINA EL POWERUP DEL ARRAY
    const powerup = room.powerups.splice(index, 1)[0];

    // SE COMPRUEBA SI UN JUGADOR ESTÁ EN LA POSICIÓN DEL POWERUP, APLICANDO COLLIDERS
    const player = room.players.find(p => {
      const px = Math.floor(p.x / tileSize);
      const topY = p.y - COLLIDER_OFFSET_Y;
      const bottomY = p.y + COLLIDER_OFFSET_Y + COLLIDER_HALF_HEIGHT;

      const pyTop = Math.floor(topY / tileSize);
      const pyBottom = Math.floor(bottomY / tileSize);
      
      return px === x && (pyTop === y || pyBottom === y);
    });

    if (!player) return;

    // SE OBTIENE EL TIPO DE POWERUP QUE HA COGIDO EL JUGADOR
    switch (powerup.type) {
      case "bombs":
        player.maxBombs = Math.min(player.maxBombs + 1, 3);
        break;

      case "range":
        player.explosionRange = Math.min(player.explosionRange + 1, 3);
        break;

      case "speed":
        player.activationSpeed = Math.min(player.activationSpeed + 1, 4);
        break;

      case "life":
        player.lifes = Math.min(player.lifes + 1, 3);
        break;

      default:
        console.warn("[SERVER] Tipo de powerup desconocido:", powerup.type);
        return;
    } 

    // AVISA A LOS JUGADORES DEL POWERUP QUE SE HA OBTENIDO PARA QUE ELIMINEN EL SPRITE Y ACTUALICEN EL VALOR
    broadcast(room, {
      type: "powerupCollected",
      playerId: player.id,
      powerupType: powerup.type,
      x, y,
      stats: {
        maxBombs: player.maxBombs,
        explosionRange: player.explosionRange,
        activationSpeed: player.activationSpeed,
        lifes: player.lifes
      }
    });
  }


  // FUNCIÓN QUE COMPRUEBA SI SE PUEDEN MOVER A UN TILE O NO
  function canMoveTo(room, newX, newY, dir) { 
    let checkX = newX; 
    let checkY = newY; 
    // SE OBTIENE LA NUEVA POSICIÓN Y MEDIANTE EL COLLIDER Y EL TILE QUE HAY EN ESA POSICIÓN, SE COMPRUEBA SI EL JUGADOR PUEDE IR O NO A ESE TILE
    if (dir === 'down') { 
      checkY = newY + COLLIDER_OFFSET_Y + COLLIDER_HALF_HEIGHT; 
    } if (dir === 'up') { 
      checkY = newY; 
    } if (dir === 'left') { 
      checkX = newX - 10; 
    } if (dir === 'right') { 
      checkX = newX + 10; 
    } 
    const tileX = Math.floor(checkX / tileSize); 
    const tileY = Math.floor(checkY / tileSize); 
    return room.logicMap[tileY][tileX] === TILE_EMPTY; 
  }

  // FUNCIÓN QUE ACTUALIZA LAS EXPLOSIONES
  function updateExplosions(room) {
    const now = Date.now();

    room.activeExplosions = room.activeExplosions.filter(explosion => {

      // SI LA MANCHA LLEVA MÁS DE 2 SEGUNDOS, SE ELIMINA
      if (now - explosion.createdAt >= 2000) {
        return false;
      }

      // SI NO, COMPRUEBA PARA CADA JUGADOR SU ÚLTIMO DAÑO Y SI ESTÁ EN UNA CASILLA DE MANCHA
      room.players.forEach(player => {
        if (!player.alive) return;

        const lastHit = explosion.lastDamageTick.get(player.id) || 0;
        if (now - lastHit < 1000) return;

        const px = Math.floor(player.x / tileSize);

        const feetY = player.y + COLLIDER_OFFSET_Y + COLLIDER_HALF_HEIGHT;
        const pyFeet = Math.floor(feetY / tileSize);

        const hit = explosion.tiles.some(t =>
          t.x === px && t.y === pyFeet
        );

        // SI NO SE LE PUEDE HACER DAÑO, NO HACE NADA
        if (!hit) return;

        // SI SE LE PUEDE HACER DAÑO, SE ACTUALIZA LA ÚLTIMA VEZ QUE RECIBIÓ DAÑO, Y SE LE RESTA UNA VIDA
        explosion.lastDamageTick.set(player.id, now);
        player.lifes--;

        // SI LAS VIDAS LLEGAN A 0, SE AVISA AL CLIENTE DE QUE EL JUGADOR A MUERTO
        if (player.lifes <= 0) {
          player.alive = false;

          broadcast(room, {
            type: "playerDied",
            playerId: player.id
          });
        } else {
          // SI NO, SE NOTIFICA QUE UN JUGADOR HA SIDO DAÑADO
          broadcast(room, {
            type: "playerDamaged",
            playerId: player.id,
            lifes: player.lifes
          });
        }
      });

      return true;
    });
  }
  
  // FUNCIÓN QUE GESTIONA CUANDO UN JUGADOR SALE DE LA PARTIDA
  function handlePlayerLeave(ws){
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.ws === ws);
    if (!player) return;

    // PARA LA GESTIÓN DE LA DESCONEXIÓN, SE HA OPTADO POR HACER QUE EL JUGADOR MUERA Y DARLE LA VICTORIA AL OTRO
    player.alive = false;
    player.lifes = 0;

    broadcast(room, {
      type: "playerDied",
      playerId: player.id,
    });
  }


  // FUNCIÓN DE GESTIÓN DE TODOS LOS BROADCASTS
  function broadcast(room, data) {
    let payload = null;

    switch (data.type) {

      case "bombSpawned":
        payload = {
          type: "bombSpawned",
          x: data.x,
          y: data.y,
          owner: data.owner,
          activationSpeed: data.activationSpeed,
          explosionRange: data.explosionRange
        };
        break;

      case "bombExploded":
        payload = {
          type: "bombExploded",
          x: data.x,
          y: data.y,
          tiles: data.tiles
        };
        break;

      case "blockDestroyed": 
        payload = { 
          type: "blockDestroyed", 
          x: data.x, 
          y: data.y 
        }; 
        break;

      case "powerupSpawned":
        payload = {
          type: "powerupSpawned",
          x: data.x,
          y: data.y,
          powerupType: data.powerupType
        };
        break;

      case "playerDied":
        payload = {
          type: "playerDied",
          playerId: data.playerId
        };
        break;

      case "stateUpdate":
        payload = {
          type: "stateUpdate",
          players: data.players
        };
        break;

      case "powerupCollected":
        payload = {
          type: "powerupCollected",
          playerId: data.playerId,
          powerupType: data.powerupType,
          x: data.x,
          y: data.y,
          stats: data.stats
        };
        break;

      case "playerDamaged":
        payload = {
          type: "playerDamaged",
          playerId: data.playerId,
          lifes: data.lifes
        };
      break;

      case "playerDied":
        payload = {
          type: "playerDied",
          playerId: data.playerId
        };
        break;

      default:
        console.warn("Broadcast desconocido:", data.type);
        return;
      }

    const message = JSON.stringify(payload);

    room.players.forEach(p => {
      if (p.ws.readyState === 1) {
        p.ws.send(message);
      }
    });
  }

  return {
    createRoom,
    sendGameInit,
    handleDisconnect,
    handlePlayerMove,
    handleBombPlaced,
    handlePowerupPickup,
    handlePlayerLeave
  };
}
