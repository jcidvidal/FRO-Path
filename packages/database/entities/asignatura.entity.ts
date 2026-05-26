import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Carrera } from "./carrera.entity.js"

@Entity()
export class Asignatura {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 10, unique: true })
    codigo_ramo!: string

    @Column({ type: "varchar", length: 255 })
    nombre!: string

    @Column({ type: "smallint" })
    sct!: number

    @Column({ type: "smallint" })
    nivel!: number

    @Column({ type: "int" })
    carrera_id!: number

    @ManyToOne(() => Carrera)
    @JoinColumn({ name: "carrera_id" })
    carrera!: Carrera
}