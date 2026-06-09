import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Asignatura } from '../../../domain/entities/course.entity';
import { PuertoRepositorioMalla } from '../../../domain/ports/mesh-repository.port';
import { EstadoAsignatura } from '../../../domain/value-objects/course-status.vo';
import { CARRERAS_SEED, estadoInicialAsignatura } from './mesh-seed';
import { obtenerDataSourceFroPath } from './postgres-data-source';
import {
  AsignaturaRegistro,
  CarreraRegistro,
  PrerrequisitoRegistro,
  ProgresoAcademicoRegistro,
  UsuarioRegistro,
} from './postgres.entities';

const EMAIL_USUARIO_FUNCIONAL = 'estudiante.funcional@fro-path.local';

@Injectable()
export class RepositorioMallaPostgres implements PuertoRepositorioMalla {
  private dataSource?: DataSource;

  async buscarPorCarrera(idCarrera: string): Promise<Asignatura[]> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const carrera = await dataSource
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({
        where: { codigo: idCarrera },
      });

    if (!carrera) {
      return [];
    }

    const asignaturas = await dataSource
      .getRepository<AsignaturaRegistro>('Asignatura')
      .find({
        where: { carrera_id: carrera.id },
        order: { nivel: 'ASC', codigo_ramo: 'ASC' },
      });
    const idsAsignaturas = asignaturas.map((asignatura) => asignatura.id);
    const prerequisitos = await dataSource
      .getRepository<PrerrequisitoRegistro>('Prerrequisito')
      .createQueryBuilder('prerrequisito')
      .where('prerrequisito.asignatura_id IN (:...ids)', {
        ids: idsAsignaturas,
      })
      .getMany();
    const progreso = await dataSource
      .getRepository<ProgresoAcademicoRegistro>('ProgresoAcademico')
      .createQueryBuilder('progreso')
      .where('progreso.usuario_id = :usuarioId', {
        usuarioId: await this.obtenerIdUsuarioFuncional(dataSource),
      })
      .andWhere('progreso.asignatura_id IN (:...ids)', { ids: idsAsignaturas })
      .getMany();

    const codigosPorId = new Map(
      asignaturas.map((asignatura) => [asignatura.id, asignatura.codigo_ramo]),
    );
    const progresoPorAsignatura = new Map(
      progreso.map((item) => [
        item.asignatura_id,
        item.estado as EstadoAsignatura,
      ]),
    );

    return asignaturas.map(
      (asignatura) =>
        new Asignatura({
          id: asignatura.codigo_ramo,
          codigo: asignatura.codigo_ramo,
          nombre: asignatura.nombre,
          sct: asignatura.sct,
          nivel: asignatura.nivel,
          estado:
            progresoPorAsignatura.get(asignatura.id) ??
            EstadoAsignatura.Disponible,
          idsPrerequisitos: prerequisitos
            .filter((item) => item.asignatura_id === asignatura.id)
            .map((item) => codigosPorId.get(item.requisito_id))
            .filter((codigo): codigo is string => Boolean(codigo)),
        }),
    );
  }

  async guardarEstadoAsignatura(
    idCarrera: string,
    asignatura: Asignatura,
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
          usuario_id: await this.obtenerIdUsuarioFuncional(dataSource),
          asignatura_id: registro.id,
          estado: asignatura.estado,
        },
        ['usuario_id', 'asignatura_id'],
      );

    return asignatura;
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
    const idUsuarioFuncional = await this.obtenerIdUsuarioFuncional(dataSource);

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

      for (const asignaturaSeed of carreraSeed.asignaturas) {
        let asignatura = await asignaturaRepo.findOne({
          where: { codigo_ramo: asignaturaSeed.codigo },
        });

        if (!asignatura) {
          asignatura = await asignaturaRepo.save({
            codigo_ramo: asignaturaSeed.codigo,
            nombre: asignaturaSeed.nombre,
            sct: asignaturaSeed.sct,
            nivel: asignaturaSeed.nivel,
            carrera_id: carrera.id,
          });
        }

        asignaturasPorCodigo.set(asignaturaSeed.codigo, asignatura);
      }

      for (const asignaturaSeed of carreraSeed.asignaturas) {
        const asignatura = asignaturasPorCodigo.get(asignaturaSeed.codigo);

        if (!asignatura) {
          continue;
        }

        await dataSource
          .getRepository<ProgresoAcademicoRegistro>('ProgresoAcademico')
          .upsert(
            {
              usuario_id: idUsuarioFuncional,
              asignatura_id: asignatura.id,
              estado: estadoInicialAsignatura(asignaturaSeed),
            },
            ['usuario_id', 'asignatura_id'],
          );

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

  private async obtenerIdUsuarioFuncional(
    dataSource: DataSource,
  ): Promise<number> {
    const repositorio = dataSource.getRepository<UsuarioRegistro>('Usuario');
    let usuario = await repositorio.findOne({
      where: { email: EMAIL_USUARIO_FUNCIONAL },
    });

    if (!usuario) {
      usuario = await repositorio.save({
        nombre: 'Estudiante',
        apellido_paterno: 'Funcional',
        apellido_materno: 'FROPath',
        email: EMAIL_USUARIO_FUNCIONAL,
        password: 'pendiente-auth',
        rol: 'estudiante',
      });
    }

    return usuario.id;
  }
}
