/**
 * Service para gestionar las conexiones activas de usuarios
 */
export function createConnectionService() {
  // Map para almacenar sesiones conectadas: sessionId -> timestamp de última conexión
  const connectedSessions = new Map();

  // Configuración de timeout (5 segundos sin actividad = desconectado)
  const CONNECTION_TIMEOUT = 5000; // 5 segundos en milisegundos
  const CLEANUP_INTERVAL = 2000;    // Limpiar cada 2 segundos

  // Limpiar sesiones inactivas periódicamente
  const cleanupInterval = setInterval(() => {

    //TIEMPO ACTUAL
    const current = Date.now();

    //RECORRE EL ARRAY DE CONNECTEDSESSIONS
    for (const [sessionId, timestamp] of connectedSessions.entries()){
      //SI EL TIEMPO DESDE LA ULTIMA VEZ QUE HABLÓ ES MENOR QUE CONNECTION_TIMEOUT
      if(current-timestamp > CONNECTION_TIMEOUT){
        //LO ELIMINA DEL MAP
        connectedSessions.delete(sessionId);
      }
    }
  }, CLEANUP_INTERVAL);

  return {
    /**
     * Registrar o actualizar la conexión de una sesión
     * @param {string} sessionId - ID único de la sesión del cliente
     * @returns {number} Número total de sesiones conectadas
     */
    updateConnection(sessionId) {
      connectedSessions.set(sessionId, Date.now());
      return connectedSessions.size;
    },

    /**
     * Obtener el número de sesiones conectadas
     * @returns {number}
     */
    getConnectedCount() {
      return connectedSessions.size;
    },

    /**
     * Detener el cleanup interval (útil para testing o shutdown)
     */
    stopCleanup() {
      clearInterval(cleanupInterval);
    }
  };
}
