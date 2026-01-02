export function createMatchmakingService(gameRoomService) {
  const queue = [];
  const pendingRooms = new Map(); // roomId -> room

  // FUNCIÓN DE PONGREST
  function joinQueue(ws) {
    if (queue.includes(ws)) return;

    // AÑADE A LA COLA EL WEBSOCKET
    queue.push(ws);

    sendQueueStatus();

    // SI LA COLA TIENE 2 JUGADORES O MÁS
    if (queue.length >= 2) {
      const p1 = queue.shift();
      const p2 = queue.shift();

      // CREA UNA SALA, Y NOTIFICA AL CLIENTE QUE LA PARTIDA HA EMPEZADO
      const room = gameRoomService.createRoom(p1, p2);
      pendingRooms.set(room.id, room);

      p1.send(JSON.stringify({
        type: 'gameStart',
        roomId: room.id,
        role: 'player1'
      }));

      p2.send(JSON.stringify({
        type: 'gameStart',
        roomId: room.id,
        role: 'player2'
      }));
    }
  }

  // SI UN JUGADOR AMBANDONA LA SALA, LO ELIMINA DE LA COLA, Y NOTIFICA AL CLIENTE
  function leaveQueue(ws) {
    const i = queue.indexOf(ws);
    if (i !== -1) queue.splice(i, 1);
    sendQueueStatus();
  }

  // CUANDO LOS JUGADORES ESTÁN LISTOS, SI HAY 2 JUGADORES, EMPIEZA LA PARTIDA
  function playerReady(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = pendingRooms.get(roomId);
    if (!room) return;

    room.readyCount = (room.readyCount || 0) + 1;

    if (room.readyCount === 2) {
      pendingRooms.delete(roomId);
      gameRoomService.sendGameInit(room);
    }
  }

  // ENVÍA AL CLIENTE EL ESTADO DE LA COLA
  function sendQueueStatus() {
    queue.forEach((ws, index) => {
      ws.send(JSON.stringify({
        type: 'queueStatus',
        position: index + 1,
        total: queue.length
      }));
    });
  }

  return {
    joinQueue,
    leaveQueue,
    playerReady
  };
}
