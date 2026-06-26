import { AppDataSource } from "./data-source.js";

AppDataSource.initialize()
    .then(() => {
        console.log("¡Conexión exitosa a la base de datos!");
    })
    .catch((error) => console.log("Error durante la conexión: ", error));
