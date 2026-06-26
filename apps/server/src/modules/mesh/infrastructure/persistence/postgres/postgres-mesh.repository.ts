import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asignatura } from '../../../domain/entities/course.entity';
import { PuertoRepositorioMalla, MallaCategorizada } from '../../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../../domain/value-objects/course-status.vo';
import { CARRERAS_SEED, type AsignaturaSeed } from './mesh-seed';
import { obtenerDataSourceFroPath } from './postgres-data-source';
import {
  AsignaturaRegistro,
  CarreraRegistro,
  PrerrequisitoRegistro,
  ProgresoAcademicoRegistro,
} from './postgres.entities';

@Injectable()
export class RepositorioMallaPostgres implements PuertoRepositorioMalla {
  private dataSource?: DataSource;

  async buscarPorCarrera(idCarrera: string, idUsuario: number): Promise<MallaCategorizada> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const carrera = await dataSource
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({
        where: { codigo: idCarrera },
      });

    if (!carrera) {
      return { asignaturas: [], modulosIngles: [], practicas: [] };
    }

    // Obtener TODAS las asignaturas de la carrera (sin filtrar por categoría)
    const asignaturas = await dataSource
      .getRepository<AsignaturaRegistro>('Asignatura')
      .find({
        where: { carrera_id: carrera.id },
        order: { nivel: 'ASC', codigo_ramo: 'ASC' },
      });

    const idsAsignaturas = asignaturas.map((a) => a.id);
    
    // Obtener prerrequisitos y progreso igual que ahora
    const prerequisitos = await dataSource
      .getRepository<PrerrequisitoRegistro>('Prerrequisito')
      .createQueryBuilder('prerrequisito')
      .where('prerrequisito.asignatura_id IN (:...ids)', { ids: idsAsignaturas })
      .getMany();
    
    const progreso = await dataSource
      .getRepository<ProgresoAcademicoRegistro>('ProgresoAcademico')
      .createQueryBuilder('progreso')
      .where('progreso.usuario_id = :usuarioId', { usuarioId: idUsuario })
      .andWhere('progreso.asignatura_id IN (:...ids)', { ids: idsAsignaturas })
      .getMany();

    const codigosPorId = new Map(asignaturas.map((a) => [a.id, a.codigo_ramo]));
    const progresoPorAsignatura = new Map(progreso.map((item) => [item.asignatura_id, item.estado as EstadoAsignatura]));
    const prerequisitosAsignatura = new Map<number, number[]>();
    for (const p of prerequisitos) {
      const lista = prerequisitosAsignatura.get(p.asignatura_id) ?? [];
      lista.push(p.requisito_id);
      prerequisitosAsignatura.set(p.asignatura_id, lista);
    }

    const mapearAsignatura = (registro: AsignaturaRegistro): Asignatura => {
      return new Asignatura({
        id: registro.codigo_ramo,
        codigo: registro.codigo_ramo,
        nombre: registro.nombre,
        sct: registro.sct,
        nivel: registro.nivel,
        estado: progresoPorAsignatura.get(registro.id) ??
                (prerequisitosAsignatura.get(registro.id)?.length
                  ? EstadoAsignatura.Bloqueada
                  : EstadoAsignatura.Disponible),
        idsPrerequisitos: (prerequisitosAsignatura.get(registro.id) ?? [])
          .map((reqId) => codigosPorId.get(reqId))
          .filter((codigo): codigo is string => Boolean(codigo)),
      });
    };

    return {
      asignaturas: asignaturas.filter(a => a.categoria === 'malla').map(mapearAsignatura),
      modulosIngles: asignaturas.filter(a => a.categoria === 'ingles').map(mapearAsignatura),
      practicas: asignaturas.filter(a => a.categoria === 'practica').map(mapearAsignatura),
    };
  }

  async guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
    idUsuario: number,
  ): Promise<Asignatura> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const registro = await this.buscarRegistroAsignatura(
      dataSource,
      idCarrera,
      asignatura.id,
    );

    await dataSource
      .getRepository<ProgresoAcademicoRegistro>('ProgresoAcademico')
      .upsert(
        {
          usuario_id: idUsuario,
          asignatura_id: registro.id,
          estado: asignatura.estado,
        },
        ['usuario_id', 'asignatura_id'],
      );

    return asignatura;
  }

  async limpiarProgreso(idCarrera: string, idUsuario: number): Promise<void> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const carrera = await dataSource
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({ where: { codigo: idCarrera } });

    if (!carrera) return;

    // Obtener TODAS las asignaturas de la carrera (sin filtrar por categoría)
    // porque debe limpiar el progreso de TODAS (incluyendo inglés y prácticas)
    const asignaturas = await dataSource
      .getRepository<AsignaturaRegistro>('Asignatura')
      .find({ where: { carrera_id: carrera.id } });

    const ids = asignaturas.map((a) => a.id);
    if (ids.length === 0) return;

    await dataSource
      .getRepository<ProgresoAcademicoRegistro>('ProgresoAcademico')
      .createQueryBuilder()
      .delete()
      .where('usuario_id = :usuarioId', { usuarioId: idUsuario })
      .andWhere('asignatura_id IN (:...ids)', { ids })
      .execute();
  }

  private async obtenerDataSourceConSeed(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = await obtenerDataSourceFroPath();
      await this.sembrarDatosBase(this.dataSource);
    }

    return this.dataSource;
  }

  private async buscarRegistroAsignatura(
    dataSource: DataSource,
    idCarrera: string,
    idAsignatura: string,
  ): Promise<AsignaturaRegistro> {
    const registro = await dataSource
      .getRepository<AsignaturaRegistro>('Asignatura')
      .createQueryBuilder('asignatura')
      .innerJoin('asignatura.carrera', 'carrera')
      .where('carrera.codigo = :idCarrera', { idCarrera })
      .andWhere('asignatura.codigo_ramo = :idAsignatura', { idAsignatura })
      .getOne();

    if (!registro) {
      throw new Error(`La asignatura ${idAsignatura} no existe.`);
    }

    return registro;
  }

  private async sembrarDatosBase(dataSource: DataSource): Promise<void> {
    for (const carreraSeed of CARRERAS_SEED) {
      const carreraRepo = dataSource.getRepository<CarreraRegistro>('Carrera');
      let carrera = await carreraRepo.findOne({
        where: { codigo: carreraSeed.codigo },
      });

      if (!carrera) {
        carrera = await carreraRepo.save({
          codigo: carreraSeed.codigo,
          nombre: carreraSeed.nombre,
        });
      }

      const asignaturaRepo =
        dataSource.getRepository<AsignaturaRegistro>('Asignatura');
      const asignaturasPorCodigo = new Map<string, AsignaturaRegistro>();

      // Función helper para insertar asignaturas con categoría
      const sembrarAsignaturas = async (items: AsignaturaSeed[], categoria: string) => {
        for (const item of items) {
          let asignatura = await asignaturaRepo.findOne({
            where: { codigo_ramo: item.codigo },
          });
          if (!asignatura) {
            asignatura = await asignaturaRepo.save({
              codigo_ramo: item.codigo,
              nombre: item.nombre,
              sct: item.sct,
              nivel: item.nivel,
              carrera_id: carrera.id,
              categoria: categoria,
            });
          }
          asignaturasPorCodigo.set(item.codigo, asignatura);
        }
      };

      // Sembrar asignaturas de malla
      await sembrarAsignaturas(carreraSeed.asignaturas, 'malla');
      
      // Sembrar módulos de inglés
      if (carreraSeed.modulosIngles) {
        await sembrarAsignaturas(carreraSeed.modulosIngles, 'ingles');
      }
      
      // Sembrar prácticas
      if (carreraSeed.practicas) {
        await sembrarAsignaturas(carreraSeed.practicas, 'practica');
      }

      // Insertar prerrequisitos para todas las categorías (el Map incluye todas las asignaturas)
      const todasLasAsignaturasSeed = [
        ...carreraSeed.asignaturas,
        ...(carreraSeed.modulosIngles ?? []),
        ...(carreraSeed.practicas ?? []),
      ];

      for (const asignaturaSeed of todasLasAsignaturasSeed) {
        const asignatura = asignaturasPorCodigo.get(asignaturaSeed.codigo);

        if (!asignatura) {
          continue;
        }

        for (const requisitoCodigo of asignaturaSeed.requisitos ?? []) {
          const requisito = asignaturasPorCodigo.get(requisitoCodigo);

          if (!requisito) {
            continue;
          }

          await dataSource
            .getRepository<PrerrequisitoRegistro>('Prerrequisito')
            .upsert(
              {
                asignatura_id: asignatura.id,
                requisito_id: requisito.id,
              },
              ['asignatura_id', 'requisito_id'],
            );
        }
      }
    }
  }
}
