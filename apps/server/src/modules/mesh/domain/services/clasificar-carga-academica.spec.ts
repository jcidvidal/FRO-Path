import { clasificarCargaAcademica } from './clasificar-carga-academica';

describe('clasificarCargaAcademica', () => {
  it('clasifica como ligero cuando hay 3 ramos o menos', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 3,
      sctEnCurso: 18,
    });

    expect(resultado.nivel).toBe('ligero');
    expect(resultado.ramosAdicionalesSugeridos).toBe(2);
  });

  it('clasifica como equilibrado con 4 ramos', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 4,
      sctEnCurso: 24,
    });

    expect(resultado.nivel).toBe('equilibrado');
    expect(resultado.ramosAdicionalesSugeridos).toBe(1);
  });

  it('clasifica como equilibrado con 5 ramos y no sugiere más ramos', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 5,
      sctEnCurso: 25,
    });

    expect(resultado.nivel).toBe('equilibrado');
    expect(resultado.ramosAdicionalesSugeridos).toBe(0);
  });

  it('clasifica como excesivo cuando hay más de 5 ramos', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 6,
      sctEnCurso: 28,
    });

    expect(resultado.nivel).toBe('excesivo');
    expect(resultado.ramosAdicionalesSugeridos).toBe(0);
  });

  it('clasifica como excesivo cuando la suma de SCT supera 30 aunque sean pocos ramos', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 5,
      sctEnCurso: 31,
    });

    expect(resultado.nivel).toBe('excesivo');
    expect(resultado.ramosAdicionalesSugeridos).toBe(0);
  });

  it('clasifica como ligero un semestre vacío', () => {
    const resultado = clasificarCargaAcademica({
      cantidadEnCurso: 0,
      sctEnCurso: 0,
    });

    expect(resultado.nivel).toBe('ligero');
    expect(resultado.ramosAdicionalesSugeridos).toBe(5);
  });
});
