import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
    let controller: TasksController;
    let mockService: any;

    beforeEach(async () => {
        mockService = {
            create: jest.fn(),
            findAllWithFilters: jest.fn(),
            update: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [{ provide: TasksService, useValue: mockService }],
        }).compile();

        controller = module.get<TasksController>(TasksController);
    });

    it('should handle CRUD operations', async () => {
        const mockTask = { id: 1, title: 'Test' };

        // Test create
        mockService.create.mockResolvedValue(mockTask);
        const created = await controller.create({ title: 'Test' });
        expect(created).toEqual(mockTask);

        // Test findAll
        mockService.findAllWithFilters.mockResolvedValue([mockTask]);
        const found = await controller.findAll();
        expect(found).toEqual([mockTask]);
    });
});