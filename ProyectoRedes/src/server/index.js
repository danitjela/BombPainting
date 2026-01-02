import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import { createGameRoomService } from './services/gameRoomService.js';
import { createMatchmakingService } from './services/matchmakingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gameRoomService = createGameRoomService();
const matchmakingService = createMatchmakingService(gameRoomService);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../../dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

// CLASE DEL EJEMPLO PONGREST AÑADIDOS LOS CASOS AL SWITCH NECESARIOS
wss.on('connection', (ws) => {
  console.log('Cliente WS conectado');

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    // DEPENDIENDO DE LA NOTIFICACIÓN DEL CLIENTE, UTILIZA UNA CLASE DEL SERVIDOR
    switch (data.type) {
      case 'joinQueue':
        matchmakingService.joinQueue(ws);
        break;

      case 'leaveQueue':
        matchmakingService.leaveQueue(ws);
        break;

      case 'readyForGame':
        matchmakingService.playerReady(ws);
        break;

      case 'playerMove':
        gameRoomService.handlePlayerMove(ws, data.dir);
        break;

      case 'bombPlaced':
        gameRoomService.handleBombPlaced(ws);
        break;

      case 'powerupPickup':
        gameRoomService.handlePowerupPickup(ws, data.x, data.y);
        break;
      
      case 'playerLeave':
        gameRoomService.handlePlayerLeave(ws);
        break;

      default:
        console.log('Mensaje desconocido:', data.type);
    }
  });

  ws.on('close', () => {
    matchmakingService.leaveQueue(ws);
    gameRoomService.handleDisconnect(ws);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`WebSocket en ws://localhost:${PORT}`);
});
