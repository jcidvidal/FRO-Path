/*import { AppDataSource } from "./data-source.js"; // Importamos la conexión
import { Usuario } from "./entities/usuario.entity.js";

// Agregamos 'async' porque la función debe esperar a la base de datos
async function crearUsuario(id: string, nombre: string, email: string, password: string): Promise<Usuario> {
    // 1. Obtenemos la herramienta que controla la tabla Usuario
    const usuarioRepo = AppDataSource.getRepository(Usuario);

    // 2. Preparamos el registro en memoria usando el repositorio
    const nuevoUsuario = usuarioRepo.create({
        rut: id,
        nombre: nombre,
        email: email,
        password: password
    });

    // 3. ¡Falta el paso para guardar físicamente en PostgreSQL!
    // ???
    
    console.log(`👤 Usuario ${nombre} creado con éxito.`);
    return nuevoUsuario;
}
*/