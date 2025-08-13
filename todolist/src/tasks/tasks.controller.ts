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
import { FilterTaskDto } from './dto/filter-task.dto';

/**
 * @class TasksController
 * @description Controlador REST para gestión de tareas, uso de Pipes para validar los datos
 */

@Controller('api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * Crea una nueva tarea
   * @param {CreateTaskDto} createTaskDto - Datos de la nueva tarea
   * @returns {Promise<Task>} La tarea creada con ID asignado
   * @throws {BadRequestException} Si los datos son inválidos
   * @example
   * POST /api/tasks
   * Body: { "title": "Nueva tarea", "description": "Descripción", etc... }
   */

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * Obtiene todas las tareas con filtros opcionales
   * @param {FilterTaskDto} filters - Filtros de estado y fechas
   * @returns {Promise<Task[]>} Lista de tareas que cumplen los criterios
   * @throws {BadRequestException} Si los filtros tienen formato incorrecto
   * @example
   * GET /api/tasks
   * Body: { "completed": false, "dateFrom": "2024-01-01" }
   */

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Body() filterDto?: FilterTaskDto) {
    return this.tasksService.findAllWithFilters(filterDto);
  }

  /**
   * Actualiza una nueva tarea
   * @param {UpdateTaskDto} updateTaskDto - Datos nuevos de la tarea con id requerido
   * @returns {Promise<Task>} La tarea modificada
   * @throws {BadRequestException} Si los datos son inválidos
   * @example
   * PUT /api/tasks/123
   * Body: { "description": "nueva descripción" }
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
   * Actualiza una nueva tarea
   * @param {int} id - Id de la tarea a eliminar
   * @returns {Promise<Task>} La tarea eliminada
   * @throws {BadRequestException} Si el id es inválido
   * @example
   * DELETE /api/tasks/123
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
