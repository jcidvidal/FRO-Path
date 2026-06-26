import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import {
  CarreraRegistro,
  UsuarioRegistro,
} from '../../mesh/infrastructure/persistence/postgres/postgres.entities';
import { obtenerDataSourceFroPath } from '../../mesh/infrastructure/persistence/postgres/postgres-data-source';
import { UsuarioAutenticado, UsuarioConPassword } from '../domain/auth-user';
import { RolUsuario } from '../domain/roles';

interface CrearUsuarioEntrada {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  idCarrera?: string;
}

const USUARIOS_SEED: CrearUsuarioEntrada[] = [
  {
    nombre: 'Estudiante',
    apellidoPaterno: 'Demo',
    apellidoMaterno: 'FROPath',
    email: 'estudiante@fro-path.local',
    passwordHash: '',
    rol: RolUsuario.Estudiante,
  },
  {
    nombre: 'Profesor',
    apellidoPaterno: 'Demo',
    apellidoMaterno: 'FROPath',
    email: 'profesor@fro-path.local',
    passwordHash: '',
    rol: RolUsuario.Profesor,
  },
  {
    nombre: 'Director',
    apellidoPaterno: 'Demo',
    apellidoMaterno: 'FROPath',
    email: 'director@fro-path.local',
    passwordHash: '',
    rol: RolUsuario.Director,
  },
  {
    nombre: 'Admin',
    apellidoPaterno: 'Demo',
    apellidoMaterno: 'FROPath',
    email: 'admin@fro-path.local',
    passwordHash: '',
    rol: RolUsuario.Admin,
  },
];

@Injectable()
export class UsuariosRepository {
  private dataSource?: DataSource;

  async buscarPorEmail(email: string): Promise<UsuarioConPassword | null> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const usuario = await dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .findOne({
        where: { email: this.normalizarEmail(email) },
        relations: { carrera: true },
      });

    return usuario ? this.mapearConPassword(usuario) : null;
  }

  async buscarPorId(id: number): Promise<UsuarioAutenticado | null> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const usuario = await dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .findOne({ where: { id }, relations: { carrera: true } });

    return usuario ? this.mapear(usuario) : null;
  }

  async crear(entrada: CrearUsuarioEntrada): Promise<UsuarioAutenticado> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const carrera = await this.buscarCarreraPorCodigo(
      dataSource,
      entrada.idCarrera,
    );

    const usuario = await dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .save({
        nombre: entrada.nombre,
        apellido_paterno: entrada.apellidoPaterno,
        apellido_materno: entrada.apellidoMaterno,
        email: this.normalizarEmail(entrada.email),
        password: entrada.passwordHash,
        rol: entrada.rol,
        carrera_id: carrera?.id ?? null,
      });

    return this.mapear({ ...usuario, carrera: carrera ?? null });
  }

  private async buscarCarreraPorCodigo(
    dataSource: DataSource,
    codigo?: string,
  ): Promise<CarreraRegistro | null> {
    const codigoNormalizado = codigo?.trim();
    if (!codigoNormalizado) {
      return null;
    }

    return dataSource
      .getRepository<CarreraRegistro>('Carrera')
      .findOne({ where: { codigo: codigoNormalizado } });
  }

  async buscarEstudiantes(busqueda?: string): Promise<UsuarioAutenticado[]> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const consulta = dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.carrera', 'carrera')
      .where('usuario.rol = :rol', { rol: RolUsuario.Estudiante });

    const termino = busqueda?.trim();
    if (termino) {
      consulta.andWhere(
        `(usuario.nombre ILIKE :patron
          OR usuario.apellido_paterno ILIKE :patron
          OR usuario.apellido_materno ILIKE :patron
          OR usuario.email ILIKE :patron)`,
        { patron: `%${termino}%` },
      );
    }

    const usuarios = await consulta
      .orderBy('usuario.apellido_paterno', 'ASC')
      .addOrderBy('usuario.apellido_materno', 'ASC')
      .addOrderBy('usuario.nombre', 'ASC')
      .take(50)
      .getMany();

    return usuarios.map((usuario) => this.mapear(usuario));
  }

  async buscarUsuarios(filtro: {
    busqueda?: string;
    roles: RolUsuario[];
  }): Promise<UsuarioAutenticado[]> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const consulta = dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.carrera', 'carrera')
      .where('usuario.rol IN (:...roles)', { roles: filtro.roles });

    const termino = filtro.busqueda?.trim();
    if (termino) {
      consulta.andWhere(
        `(usuario.nombre ILIKE :patron
          OR usuario.apellido_paterno ILIKE :patron
          OR usuario.apellido_materno ILIKE :patron
          OR usuario.email ILIKE :patron)`,
        { patron: `%${termino}%` },
      );
    }

    const usuarios = await consulta
      .orderBy('usuario.apellido_paterno', 'ASC')
      .addOrderBy('usuario.apellido_materno', 'ASC')
      .addOrderBy('usuario.nombre', 'ASC')
      .take(50)
      .getMany();

    return usuarios.map((usuario) => this.mapear(usuario));
  }

  async actualizarRol(
    id: number,
    rol: RolUsuario.Profesor | RolUsuario.Director,
  ): Promise<UsuarioAutenticado> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const repositorio = dataSource.getRepository<UsuarioRegistro>('Usuario');
    const usuario = await repositorio.findOneByOrFail({ id });
    usuario.rol = rol;

    return this.mapear(await repositorio.save(usuario));
  }

  async actualizar(
    id: number,
    datos: Partial<Pick<UsuarioRegistro, 'nombre' | 'apellido_paterno' | 'apellido_materno' | 'email' | 'rol'>>,
  ): Promise<UsuarioAutenticado> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const repositorio = dataSource.getRepository<UsuarioRegistro>('Usuario');
    await repositorio.update(id, datos);
    const usuario = await repositorio.findOne({
      where: { id },
      relations: { carrera: true },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return this.mapear(usuario);
  }

  async eliminar(id: number): Promise<void> {
    const dataSource = await this.obtenerDataSourceConSeed();
    await dataSource.getRepository<UsuarioRegistro>('Usuario').delete({ id });
  }

  private async obtenerDataSourceConSeed(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = await obtenerDataSourceFroPath();
      await this.sembrarUsuarios(this.dataSource);
    }

    return this.dataSource;
  }

  private async sembrarUsuarios(dataSource: DataSource): Promise<void> {
    const repositorio = dataSource.getRepository<UsuarioRegistro>('Usuario');
    const passwordHash = await hash('Pass1234', 10);

    for (const usuarioSeed of USUARIOS_SEED) {
      const existente = await repositorio.findOne({
        where: { email: usuarioSeed.email },
      });

      if (!existente) {
        await repositorio.save({
          nombre: usuarioSeed.nombre,
          apellido_paterno: usuarioSeed.apellidoPaterno,
          apellido_materno: usuarioSeed.apellidoMaterno,
          email: usuarioSeed.email,
          password: passwordHash,
          rol: usuarioSeed.rol,
        });
      }
    }
  }

  private mapear(usuario: UsuarioRegistro): UsuarioAutenticado {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellido_paterno,
      apellidoMaterno: usuario.apellido_materno,
      email: usuario.email,
      rol: usuario.rol as RolUsuario,
      idCarrera: usuario.carrera?.codigo ?? null,
      nombreCarrera: usuario.carrera?.nombre ?? null,
    };
  }

  private mapearConPassword(usuario: UsuarioRegistro): UsuarioConPassword {
    return {
      ...this.mapear(usuario),
      passwordHash: usuario.password,
    };
  }

  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
