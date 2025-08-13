import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Delete,
    ValidationPipe,
    UsePipes,
    ParseIntPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Controller('api/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    // POST /api/tasks - Crear tarea
    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    // GET /api/tasks - Obtener todas las tareas
    @Get()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    findAll(@Body() filterDto?: FilterTaskDto) {
        return this.tasksService.findAllWithFilters(filterDto);
    }

    // PUT /api/tasks/123 - Actualizar tarea
    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    // DELETE /api/tasks/123 - Eliminar tarea
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(id);
    }
}