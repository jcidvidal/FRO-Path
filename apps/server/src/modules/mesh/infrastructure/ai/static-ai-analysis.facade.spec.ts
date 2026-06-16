import { FachadaAnalisisIaEstatico } from './static-ai-analysis.facade';

describe('FachadaAnalisisIaEstatico', () => {
  const fachada = new FachadaAnalisisIaEstatico();

  it('retorna un resumen que incluye el id de la carrera', async () => {
    const resultado = await fachada.analizar({
      idCarrera: 'icc',
      idsAsignaturasSeleccionadas: [],
      idsAsignaturasAprobadas: [],
    });

    expect(resultado.resumen).toContain('icc');
    expect(resultado.advertencias).toEqual([]);
    expect(resultado.recomendaciones.length).toBeGreaterThan(0);
  });
});
