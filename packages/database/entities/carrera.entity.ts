import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Carrera {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column({ type: "varchar", length: 10, unique: true })
    codigo!: string

    @Column({ type: "varchar", length: 255 })
    nombre!: string 
}