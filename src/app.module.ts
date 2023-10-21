import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { FollowingModule } from './following/following.module';

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
  UsersModule,
  PostModule,
  FollowingModule,
];

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
