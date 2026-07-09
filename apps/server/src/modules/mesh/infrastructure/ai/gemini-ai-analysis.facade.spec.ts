import { FachadaAnalisisIaGemini } from './gemini-ai-analysis.facade';

function respuestaGeminiConTexto(texto: string) {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        candidates: [{ content: { parts: [{ text: texto }] } }],
      }),
  } as Response;
}

describe('FachadaAnalisisIaGemini', () => {
  const entrada = {
    idCarrera: 'icc',
    idsAsignaturasSeleccionadas: ['ICC-002'],
    idsAsignaturasAprobadas: ['ICC-001'],
  };

  let fetchMock: jest.SpyInstance;
  let fachada: FachadaAnalisisIaGemini;

  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch');
    fachada = new FachadaAnalisisIaGemini('api-key-falsa', 'gemini-2.5-flash');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('envía la clave en el header x-goog-api-key y mapea la respuesta', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(
        JSON.stringify({
          resumen: 'Carga equilibrada.',
          advertencias: ['Revisa los prerequisitos.'],
          recomendaciones: ['Inscribe primero ICC-002.'],
        }),
      ),
    );

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toBe('Carga equilibrada.');
    expect(resultado.advertencias).toEqual(['Revisa los prerequisitos.']);
    expect(resultado.recomendaciones).toEqual(['Inscribe primero ICC-002.']);

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toContain('gemini-2.5-flash:generateContent');
    expect(
      (opciones as RequestInit).headers as Record<string, string>,
    ).toMatchObject({ 'x-goog-api-key': 'api-key-falsa' });
  });

  it('completa con valores por defecto si faltan campos en la respuesta', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(JSON.stringify({ resumen: 'Solo resumen.' })),
    );

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toBe('Solo resumen.');
    expect(resultado.advertencias).toEqual([]);
    expect(resultado.recomendaciones).toEqual([]);
  });

  it('devuelve un resultado degradado si Gemini responde con error HTTP', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Too Many Requests'),
    } as Response);

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toContain('No se pudo generar el análisis');
    expect(resultado.advertencias).toEqual([]);
    expect(resultado.recomendaciones).toEqual([]);
  });

  it('devuelve un resultado degradado si la respuesta llega sin candidatos', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toContain('No se pudo generar el análisis');
  });

  it('devuelve un resultado degradado si fetch lanza una excepción de red', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toContain('No se pudo generar el análisis');
  });

  it('incluye "ninguna" en el prompt cuando los arrays de ids estan vacios', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(
        JSON.stringify({ resumen: 'Sin asignaturas.', advertencias: [], recomendaciones: [] }),
      ),
    );

    const entradaVacia = {
      idCarrera: 'icc',
      idsAsignaturasSeleccionadas: [],
      idsAsignaturasAprobadas: [],
    };

    await fachada.analizar(entradaVacia);

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    const prompt: string = body.contents[0].parts[0].text;
    expect(prompt).toContain('ninguna');
  });

  it('devuelve un resultado degradado si fetch lanza un valor que no es una instancia de Error', async () => {
    fetchMock.mockRejectedValue('fallo como string');

    const resultado = await fachada.analizar(entrada);

    expect(resultado.resumen).toContain('No se pudo generar el análisis');
    expect(resultado.advertencias).toEqual([]);
    expect(resultado.recomendaciones).toEqual([]);
  });
});
