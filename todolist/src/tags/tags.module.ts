import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsController } from './tags.controller';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/tasks.entity';

@Module({
    imports: [SequelizeModule.forFeature([Task])],
    controllers: [TagsController],
    providers: [TasksService],
})
export class TagsModule { }