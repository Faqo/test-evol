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
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

/**
 * @class TasksController
 * @description Controlador REST para gestión de tareas, uso de Pipes para validar los datos
 */

@Controller('api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * Crea una nueva tarea
   * POST /api/tasks
   * Body: { "title": "Nueva tarea", "description": "Descripción", etc... }
   */

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * Obtiene todas las tareas
   * GET /api/tasks
   */

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll() {
    return this.tasksService.findAll();
  }

  /**
   * Actualiza una nueva tarea
   * PUT /api/tasks/123
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * Elimina una tarea con id
   * DELETE /api/tasks/123
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
