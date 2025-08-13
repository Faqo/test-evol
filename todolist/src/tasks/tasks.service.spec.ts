import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';

describe('TasksService', () => {
    let service: TasksService;
    let mockTaskModel: any;

    beforeEach(async () => {
        mockTaskModel = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getModelToken(Task), useValue: mockTaskModel }
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    it('should create and find tasks', async () => {
        const mockTask = { id: 1, title: 'Test', completed: false };

        // Test create
        mockTaskModel.create.mockResolvedValue(mockTask);
        const created = await service.create({ title: 'Test' });
        expect(created).toEqual(mockTask);

        // Test findAll
        mockTaskModel.findAll.mockResolvedValue([mockTask]);
        const found = await service.findAllWithFilters({});
        expect(found).toEqual([mockTask]);
    });

    it('should update and get tags', async () => {
        const mockTask = { update: jest.fn(), destroy: jest.fn() };
        mockTaskModel.findByPk.mockResolvedValue(mockTask);

        // Test update
        await service.update(1, { title: 'Updated' });
        expect(mockTask.update).toHaveBeenCalled();

        // Test getAllTags
        mockTaskModel.findAll.mockResolvedValue([
            { tags: ['work', 'personal'] }
        ]);
        const tags = await service.getAllTags();
        expect(tags).toEqual(['work', 'personal']);
    });
});