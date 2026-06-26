import { DataSource } from 'typeorm';
import {
  AsignaturaSchema,
  CarreraSchema,
  PrerrequisitoSchema,
  ProgresoAcademicoSchema,
  UsuarioSchema,
} from './postgres.entities';

export const FroPathDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5435),
  username: process.env.DB_USER ?? 'admin',
  password: process.env.DB_PASSWORD ?? 'mallaufro',
  database: process.env.DB_NAME ?? 'mallaufro',
  synchronize: process.env.DB_SYNCHRONIZE !== 'false',
  logging: process.env.DB_LOGGING === 'true',
  entities: [
    CarreraSchema,
    AsignaturaSchema,
    PrerrequisitoSchema,
    UsuarioSchema,
    ProgresoAcademicoSchema,
  ],
});

export async function obtenerDataSourceFroPath(): Promise<DataSource> {
  if (!FroPathDataSource.isInitialized) {
    await FroPathDataSource.initialize();
  }

  return FroPathDataSource;
}
