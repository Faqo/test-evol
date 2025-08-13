import { Controller, Get } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Controller('api/tags')
export class TagsController {
    constructor(private readonly tasksService: TasksService) { }

    // Get /api/tags
    @Get()
    async getAllTags(): Promise<string[]> {
        const tags = await this.tasksService.getAllTags();
        return tags as string[];
    }
}