import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"
import { Usuario } from "./usuario.entity.js"
import { Asignatura } from "./asignatura.entity.js"

@Entity()
export class ProgresoAcademico {
    @PrimaryColumn({ type: "int" })
    usuario_id!: number

    @PrimaryColumn({ type: "int" })
    asignatura_id!: number

    @Column({ type: "enum", enum: ["aprobada", "reprobada", "en_curso", "bloqueada", "disponible"] })
    estado!: string

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: "usuario_id" })
    usuario!: Usuario

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "asignatura_id" })
    asignatura!: Asignatura
}
