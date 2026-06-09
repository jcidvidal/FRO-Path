import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Carrera {
    @PrimaryColumn({type: "varchar", length: 36}) //Estes es un UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    id!: string

    @Column({ type: "varchar", length: 28 }) // 22 Ingeniería Informática, 28 Ingeniería Civil Informática
    nombre!: string 
}