import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Op, WhereOptions } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  // Crear una nueva tarea
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Convertir fecha de string a Date si existe
    const taskData = {
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
    };

    return this.taskModel.create(taskData);
  }

  // Obtener todas las tareas (con filtros opcionales)
  async findAllWithFilters(filterDto: FilterTaskDto = {}): Promise<Task[]> {
    const whereCondition: WhereOptions = {};

    // Filtro por estado completado
    if (filterDto.completed !== undefined) {
      whereCondition.completed = filterDto.completed;
    }

    // Filtros de fecha - basados en createdAt
    if (filterDto.dateFrom || filterDto.dateTo) {
      const createdAtFilter: { [key: symbol]: Date } = {};

      if (filterDto.dateFrom) {
        createdAtFilter[Op.gte] = new Date(filterDto.dateFrom);
      }

      if (filterDto.dateTo) {
        // Incluir todo el día hasta las 23:59:59
        const endDate = new Date(filterDto.dateTo);
        endDate.setHours(23, 59, 59, 999);
        createdAtFilter[Op.lte] = endDate;
      }

      whereCondition.createdAt = createdAtFilter;
    }

    return this.taskModel.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
    });
  }

  //por compatibilidad con metodos de Tag
  async findAll(): Promise<Task[]> {
    return this.findAllWithFilters({});
  }

  // Obtener una tarea por ID
  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);

    if (!task) {
      throw new NotFoundException(`No encontré la tarea con ID ${id}`);
    }

    return task;
  }

  // Actualizar una tarea
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id); // Primero verificar que existe

    const updateData: Record<string, any> = { ...updateTaskDto };

    // Convertir dueDate de string a Date si existe
    if (updateTaskDto.dueDate) {
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    }

    await task.update(updateData);
    return task;
  }

  // Eliminar una tarea
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id); // Primero verificar que existe
    await task.destroy();
  }

  // Obtener todas las etiquetas únicas
  async getAllTags(): Promise<string[]> {
    const tasks = await this.taskModel.findAll({
      attributes: ['tags'],
    });

    // Juntar todas las etiquetas y quitar duplicados
    const allTags = new Set<string>();
    for (const task of tasks) {
      if (task.tags && Array.isArray(task.tags)) {
        for (const tag of task.tags) {
          allTags.add(tag);
        }
      }
    }

    return Array.from(allTags); // Quitar duplicados
  }
}
