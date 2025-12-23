/**
 * Controlador de mensajes usando closures
 *
 * TODO:
 * Implementar este controlador siguiendo el patrón usado en userController.js
 *
 * Requisitos:
 * - Usar closures para encapsular las funciones
 * - Recibir el servicio como parámetro (inyección de dependencias)
 * - Manejar errores apropiadamente
 * - Usar códigos de estado HTTP correctos
 * - Validar datos de entrada
 */

export function createMessageController(messageService) {
  /**
   * POST /api/messages - Enviar un nuevo mensaje
   * Body: {email, message}
   */

  //FUNCIÓN SIGUIENDO LA ESTRUCTURA DE USERCONTROLLER
  async function create(req, res, next) {
    try {
      const { email, message } = req.body;

      if (!email || !message) {
        return res.status(400).json({
          error: 'Los campos email y message son obligatorios'
        });
      }

      const newMessage = messageService.createMessage(email, message);

      res.status(201).json(newMessage);
    } catch (error) {
      if( error.message === 'El usuario no existe'){
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * GET /api/messages - Obtener mensajes
   * Query params: ?limit=N o ?since=timestamp
   */

  //FUNCIÓN QUE DEVUELVE LOS MENSAJES DADO UN LIMITE DE MENSAJES O UN TIEMPO
  async function getMessages(req, res, next) {
    try {
      //BODY
      const { since, limit } = req.query;
      let messages;

      if (since) {
        messages = messageService.getMessagesSince(since);
      } else {
        messages = messageService.getRecentMessages(limit);
      }

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getMessages
  };
}
