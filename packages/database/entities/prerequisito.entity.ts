import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { Asignatura } from "./asignatura.entity.js"

@Entity()
export class Prerrequisito {
    @PrimaryColumn({ type: "int" })
    asignatura_id!: number

    @PrimaryColumn({ type: "int" })
    requisito_id!: number

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "asignatura_id" })
    asignatura!: Asignatura

    @ManyToOne(() => Asignatura)
    @JoinColumn({ name: "requisito_id" })
    requisito!: Asignatura
}