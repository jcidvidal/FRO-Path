import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Carrera {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 28 }) // 22 Ingeniería Informática, 28 Ingeniería Civil Informática
    nombre!: string

    @Column({ type: "varchar", length: 10, unique: true }) //ICC706
    codigo_carrera!: string
}