import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entities/User.js"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5435,
    username: "admin",
    password: "mallaufro",
    database: "malaufro",
    synchronize: true,
    logging: true,
    entities: [User],
})