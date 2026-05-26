import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 40 })
    nombre!: string

    @Column({ type: "varchar", length: 50 })
    apellido_paterno!: string

    @Column({ type: "varchar", length: 50 })
    apellido_materno!: string

    @Column({ type: "varchar",  length: 140, unique: true})
    email!: string

    @Column({ type: "varchar", length: 30 })
    password!: string
}