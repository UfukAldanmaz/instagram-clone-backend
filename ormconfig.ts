import { DataSource } from 'typeorm';

export const datasource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'instagram_clone_db',
  entities: ['./src/**/entities/*entity{.ts,.js}'],
  migrations: ['./migrations/*{.ts,.js}'],
  synchronize: true,
});
