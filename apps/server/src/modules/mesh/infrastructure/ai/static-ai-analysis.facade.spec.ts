import { FachadaAnalisisIaEstatico } from './static-ai-analysis.facade';

describe('FachadaAnalisisIaEstatico', () => {
  const fachada = new FachadaAnalisisIaEstatico();

  it('retorna un comentario que refleja la carga en curso', async () => {
    const resultado = await fachada.analizar({
      idCarrera: 'icc',
      sctEnCurso: 24,
      cantidadEnCurso: 4,
      sctAprobado: 60,
      sctTotal: 300,
      nivelCarga: 'equilibrado',
      ramosAdicionalesSugeridos: 1,
    });

    expect(resultado.comentario).toContain('24');
    expect(resultado.comentario).toContain('4');
    expect(resultado.comentario).toContain('equilibrado');
  });
});
