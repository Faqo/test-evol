import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { Task } from './tasks/tasks.entity';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot(),

    // Configuración de base de datos
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'todoapp',
      models: [Task],
      autoLoadModels: true,
      synchronize: true // Solo para desarrollo
    }),

    TasksModule,
    TagsModule
  ]
})
export class AppModule { }