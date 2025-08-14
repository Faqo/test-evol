import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  // Obtener todas las tareas 
  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll({
      order: [['createdAt', 'DESC']],
    });
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
