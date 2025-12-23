/**
 * Servicio de gestión de mensajes usando closures
 *
 * TODO:
 * Implementar este servicio siguiendo el patrón usado en userService.js
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - IMPORTANTE: Verificar que el email existe usando userService.getUserByEmail()
 *   antes de crear un mensaje
 */

export function createMessageService(userService) {
  // TODO: Declarar variables privadas
  // - Array de mensajes
  // - Contador para IDs
  let messages = [];
  let nextId = 1;

  /**
   * Crea un nuevo mensaje
   * @param {string} email - Email del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {Object} Mensaje creado
   * @throws {Error} Si el email no existe
   */
  function createMessage(email, message) {
    const user = userService.getUserByEmail(email);
    if (!user) {
      throw new Error('El usuario no existe');
    }

    const newMessage = {
      id: String(nextId),
      email,
      message,
      timestamp: new Date().toISOString()
    };
    nextId++;

    messages.push(newMessage);

    return newMessage;
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
    const lim = Number(limit) || 50;

    return messages.slice(-lim);
  }

  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    //FUNCIÓN PARA COMPLEMENTAR GETMESSAGES
    //TIEMPO PARA COMPARAR
    const sinceDate = new Date(since);
    
    //SI NO ES UN TIMESTAMP VÁLIDO
    if (isNaN(sinceDate.getTime())) {
      throw new Error('Timestamp inválido');
    }

    //DEVUELVE LOS MENSAJES POSTERIORES A LA FECHA INTRODUCIDA FECHA
    return messages.filter(
      msg => new Date(msg.timestamp) > sinceDate
    );
  }

  // Exponer la API pública del servicio
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
