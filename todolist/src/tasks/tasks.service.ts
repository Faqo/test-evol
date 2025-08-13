import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Op } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task
  ) {}

  // Crear una nueva tarea
  async create(createTaskDto: CreateTaskDto) {
    // Convertir fecha de string a Date si existe
    const taskData = {
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null
    };
    
    return this.taskModel.create(taskData);
  }

  // Obtener todas las tareas (con filtros opcionales)
  async findAllWithFilters(filterDto: FilterTaskDto = {}) {
    const whereCondition: any = {};
    
    // Filtro por estado completado
    if (filterDto.completed !== undefined) {
      whereCondition.completed = filterDto.completed;
    }
    
    // Filtros de fecha - basados en createdAt
    if (filterDto.dateFrom || filterDto.dateTo) {
      whereCondition.createdAt = {};
      
      if (filterDto.dateFrom) {
        whereCondition.createdAt[Op.gte] = filterDto.dateFrom;
      }
      
      if (filterDto.dateTo) {
        // Incluir todo el día hasta las 23:59:59
        const endDate = new Date(filterDto.dateTo);
        endDate.setHours(23, 59, 59, 999);
        whereCondition.createdAt[Op.lte] = endDate;
      }
    }

    return this.taskModel.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']]
    });
  }

  //por compatibilidad con metodos de Tag
  async findAll() {
    return this.findAllWithFilters({});
  }

  // Obtener una tarea por ID
  async findOne(id: number) {
    const task = await this.taskModel.findByPk(id);
    
    if (!task) {
      throw new NotFoundException(`No encontré la tarea con ID ${id}`);
    }
    
    return task;
  }

  // Actualizar una tarea
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id); // Primero verificar que existe
    
    // Preparar datos para actualizar
    const updateData = { ...updateTaskDto };
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate) as any;
    }
    
    await task.update(updateData);
    return task;
  }

  // Eliminar una tarea
  async remove(id: number) {
    const task = await this.findOne(id); // Primero verificar que existe
    await task.destroy();
  }

  // Obtener todas las etiquetas únicas
  async getAllTags() {
    const tasks = await this.taskModel.findAll({
      attributes: ['tags']
    });
    
    // Juntar todas las etiquetas y quitar duplicados
    const allTags: any = [];
    tasks.forEach((task: any) => {
      if (task.tags && task.tags.length > 0) {
        allTags.push(...task.tags);
      }
    });
    
    return [...new Set(allTags)]; // Quitar duplicados
  }
}