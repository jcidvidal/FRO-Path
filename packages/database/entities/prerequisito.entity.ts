import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Asignatura } from "./asignatura.entity.js"

@Entity()
export class Prerrequisito {
    @PrimaryColumn({ type: "varchar", length: 36 })//esta es una llave primaria y foranea que es un UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    asignatura_id!: string

    @PrimaryColumn({ type: "varchar", length: 36})//esta es una llave primaria y foranea que es un UUID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    requisito_id!: string

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "asignatura_id" })
    asignatura!: Asignatura

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "requisito_id" })
    requisito!: Asignatura
}