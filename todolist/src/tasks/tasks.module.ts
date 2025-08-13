import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

@Module({
  imports: [SequelizeModule.forFeature([Task])], // Registrar el modelo Task
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService] // Por si otros módulos lo necesitan
})
export class TasksModule {}