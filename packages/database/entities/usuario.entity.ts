import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number

    @Column({ type: "varchar", length: 140 })//Este es el nombre del usuario, creo que es completo
    nombre!: string

    @Column({ type: "varchar", length: 140, unique: true }) //Este es el correo, no se puede repetir
    email!: string

    @Column({ type: "varchar", length: 30 }) //Esta es la contrasenha, pero hay que ver algún metodo de encriptación para guardarla
    password!: string

    @Column({ type: "varchar", length: 20, default: "estudiante" })
    rol!: string
}
