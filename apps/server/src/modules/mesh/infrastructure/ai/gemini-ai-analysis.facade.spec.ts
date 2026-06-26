import {
  describirCarrera,
  FachadaAnalisisIaGemini,
} from './gemini-ai-analysis.facade';

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
    sctEnCurso: 24,
    cantidadEnCurso: 4,
    sctAprobado: 60,
    sctTotal: 300,
    nivelCarga: 'equilibrado' as const,
    ramosAdicionalesSugeridos: 1,
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
          comentario: 'Tu carga de 24 SCT es equilibrada.',
        }),
      ),
    );

    const resultado = await fachada.analizar(entrada);

    expect(resultado.comentario).toBe('Tu carga de 24 SCT es equilibrada.');

    const [url, opciones] = fetchMock.mock.calls[0];
    expect(url).toContain('gemini-2.5-flash:generateContent');
    expect(
      (opciones as RequestInit).headers as Record<string, string>,
    ).toMatchObject({ 'x-goog-api-key': 'api-key-falsa' });
  });

  it('incluye en el prompt la sigla oficial ICI para la malla de Ingeniería Civil Informática', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(JSON.stringify({ comentario: 'ok' })),
    );

    await fachada.analizar({ ...entrada, idCarrera: 'icc' });

    const [, opciones] = fetchMock.mock.calls[0];
    const cuerpo = JSON.parse((opciones as RequestInit).body as string) as {
      contents: { parts: { text: string }[] }[];
    };
    const prompt = cuerpo.contents[0].parts[0].text;

    expect(prompt).toContain('Ingeniería Civil Informática (sigla ICI)');
    expect(prompt).not.toContain('ICC');
  });

  it('incluye en el prompt la sigla oficial II para la malla de Ingeniería Informática', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(JSON.stringify({ comentario: 'ok' })),
    );

    await fachada.analizar({ ...entrada, idCarrera: 'ii' });

    const [, opciones] = fetchMock.mock.calls[0];
    const cuerpo = JSON.parse((opciones as RequestInit).body as string) as {
      contents: { parts: { text: string }[] }[];
    };
    const prompt = cuerpo.contents[0].parts[0].text;

    expect(prompt).toContain('Ingeniería Informática (sigla II)');
  });

  describe('describirCarrera', () => {
    it('mapea los códigos de malla a su nombre y sigla oficial sin distinguir mayúsculas', () => {
      expect(describirCarrera('icc')).toBe(
        'Ingeniería Civil Informática (sigla ICI)',
      );
      expect(describirCarrera('ICC')).toBe(
        'Ingeniería Civil Informática (sigla ICI)',
      );
      expect(describirCarrera('ii')).toBe('Ingeniería Informática (sigla II)');
    });

    it('devuelve el identificador tal cual si la carrera es desconocida', () => {
      expect(describirCarrera('xyz')).toBe('xyz');
    });
  });

  it('completa con un comentario vacío si falta el campo en la respuesta', async () => {
    fetchMock.mockResolvedValue(
      respuestaGeminiConTexto(JSON.stringify({})),
    );

    const resultado = await fachada.analizar(entrada);

    expect(resultado.comentario).toBe('');
  });

  it('devuelve un resultado degradado si Gemini responde con error HTTP', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Too Many Requests'),
    } as Response);

    const resultado = await fachada.analizar(entrada);

    expect(resultado.comentario).toContain('No se pudo generar el análisis');
  });

  it('devuelve un resultado degradado si la respuesta llega sin candidatos', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const resultado = await fachada.analizar(entrada);

    expect(resultado.comentario).toContain('No se pudo generar el análisis');
  });

  it('devuelve un resultado degradado si fetch lanza una excepción de red', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const resultado = await fachada.analizar(entrada);

    expect(resultado.comentario).toContain('No se pudo generar el análisis');
  });
});
