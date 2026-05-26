import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entities/usuario.entity.js"
import { Carrera } from "./entities/carrera.entity.js"
import { Asignatura } from "./entities/asignatura.entity.js"
import { Prerrequisito } from "./entities/prerequisito.entity.js"
import { ProgresoAcademico } from "./entities/progreso-academico.entity.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5435,
    username: "admin",
    password: "mallaufro",
    database: "mallaufro",
    synchronize: true,
    logging: true,
    entities: [Usuario, Carrera, Asignatura, Prerrequisito, ProgresoAcademico],
})