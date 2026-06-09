import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"
import { Usuario } from "./usuario.entity.js"
import { Asignatura } from "./asignatura.entity.js"

@Entity()
export class ProgresoAcademico {
    @PrimaryColumn({ type: "varchar", length: 36 })//esta es una llave primaria y foranea que es un UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    usuario_id!: string

    @PrimaryColumn({ type: "varchar", length: 36 })//esta es una llave primaria y foranea que es un UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    asignatura_id!: string

    @Column({ type: "enum", enum: ["aprobada", "reprobada", "en_curso", "bloqueada", "disponible"] })
    estado!: string

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: "usuario_id" })
    usuario!: Usuario

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "asignatura_id" })
    asignatura!: Asignatura
}
