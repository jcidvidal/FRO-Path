import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { UsuarioRegistro } from '../../mesh/infrastructure/persistence/postgres/postgres.entities';
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
      .findOne({ where: { email: this.normalizarEmail(email) } });

    return usuario ? this.mapearConPassword(usuario) : null;
  }

  async crear(entrada: CrearUsuarioEntrada): Promise<UsuarioAutenticado> {
    const dataSource = await this.obtenerDataSourceConSeed();
    const usuario = await dataSource
      .getRepository<UsuarioRegistro>('Usuario')
      .save({
        nombre: entrada.nombre,
        apellido_paterno: entrada.apellidoPaterno,
        apellido_materno: entrada.apellidoMaterno,
        email: this.normalizarEmail(entrada.email),
        password: entrada.passwordHash,
        rol: entrada.rol,
      });

    return this.mapear(usuario);
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
