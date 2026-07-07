export interface PropiedadesEstadisticasProgreso {
  sctAprobados: number;
  sctTotales: number;
  porcentaje: number;
}

export class EstadisticasProgreso {
  constructor(private readonly propiedades: PropiedadesEstadisticasProgreso) {}

  aPrimitivos(): PropiedadesEstadisticasProgreso {
    return { ...this.propiedades };
  }
}
