import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TasksService } from '../tasks/tasks.service';

describe('TagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const mockService = {
      getAllTags: jest.fn().mockResolvedValue(['work', 'personal']),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TasksService, useValue: mockService }],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should get all tags', async () => {
    const result = await controller.getAllTags();
    expect(result).toEqual(['work', 'personal']);
  });
});