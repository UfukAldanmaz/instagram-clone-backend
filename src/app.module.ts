import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

export const TypeOrmConfig = TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'instagram_clone_db',
    autoLoadEntities: true,
    entities: ['./src/app/**/entities/*entity{.ts,.js}'],
    migrations: ['./src/app/migrations/*{.ts,.js}'],
    synchronize: true,
  }),
});

const modules = [
  TypeOrmConfig,

  // App Modules
  AuthModule,
];

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
