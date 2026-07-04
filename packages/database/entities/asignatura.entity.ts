import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Carrera } from "./carrera.entity.js"

@Entity()
export class Asignatura {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 10, unique: true }) //ICC706
    codigo_ramo!: string

    @Column({ type: "varchar", length: 48 }) //42 caracteres II, 48 caracteres IIC
    nombre!: string

    @Column({ type: "tinyint" }) //30 II, 29 ICI
    sct!: number

    @Column({ type: "tinyint" }) //10 II, 13 ICI se concidderan los primeros 4 bimestres
    nivel!: number

    @Column({ type: "int" }) //esta es una llave foranea
    carrera_id!: number

    @ManyToOne(() => Carrera)
    @JoinColumn({ name: "carrera_id" })
    carrera!: Carrera
}