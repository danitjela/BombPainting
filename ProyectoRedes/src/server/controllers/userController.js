/**
 * Controlador de usuarios usando closures
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios
 * y utiliza el userService para las operaciones de datos
 *
 * Patrón: Inyección de dependencias - recibe el servicio como parámetro
 */

export function createUserController(userService) {

  //FUNCIÓN LOGIN IMPLEMENTADA PARA LA PANTALLA DE LOGIN
  async function login(req, res, next){
    try{
      //BODY CON EL EMAIL
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: 'El email es obligatorio'
        });
      }
      //LLAMA A GETUSERBYEMAIL
      const user = userService.getUserByEmail(email);

      //SI NO LO ENCUENTRA O NO EXISTE
      if(!user) {
        return res.status(400).json({
          error: 'Usuario no encontrado'
        });
      }

      //SI LO ENCUENTA, DEVUELVE EL USUARIO
      res.status(200).json(user);
    }catch(error){
      next(error);
    }
  }


  /**
   * POST /api/users - Crear nuevo usuario
   */
  async function create(req, res, next) {
    try {
      // 1. Extraer datos del body: email, name, avatar, level
      const { email, name, avatar, level } = req.body;

      // 2. Validar que los campos requeridos estén presentes (email, name)
      if (!email || !name) {
        return res.status(400).json({
          error: 'Los campos email y name son obligatorios'
        });
      }

      //SE CREA EL USUARIO CON LOS PARÁMETROS DEL BODY
      const newUser = userService.createUser({ email, name, avatar, level });

      res.status(201).json(newUser);
    } catch (error) {
      if (error.message === 'El email ya está registrado') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * GET /api/users - Obtener todos los usuarios
   */
  async function getAll(req, res, next) {
    try {
      //DEVUELVE TODOS LOS USUARIOS
      const users = userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Obtener un usuario por ID
   */
  async function getById(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.getUserById()
      const user = userService.getUserById(id);

      // 3. Si no existe, retornar 404
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // 4. Si existe, retornar 200 con el usuario
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id - Actualizar un usuario
   */
  async function update(req, res, next) {
    try {

      //ACTUALIZA EL USUARIO MEDIANTE LOS PARÁMETROS DADOS. UTILIZADO CUANDO GANA UNA PARTIDA PARA AUMENTAR EL NIVEL
      const { id } = req.params;
      const updates = req.body;

      const updatedUser = userService.updateUser(id, updates);

      if (!updatedUser) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id - Eliminar un usuario
   */
  async function remove(req, res, next) {
    //ELIMINA EL USUARIO DADO SU ID
    try {
      const { id } = req.params;

      const deleted = userService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
      });
      }

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getById,
    update,
    remove,
    login
  };
}
