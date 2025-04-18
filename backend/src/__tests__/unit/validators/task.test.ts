import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../../../validators/task';

describe('Task Validators', () => {
  describe('createTaskSchema', () => {
    it('should validate correct task creation data', () => {
      const validData = {
        title: 'Test Task',
        description: 'Test Description'
      };
      expect(() => createTaskSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Test Description'
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('should reject title longer than 100 characters', () => {
      const invalidData = {
        title: 'a'.repeat(101),
        description: 'Test Description'
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('should reject description longer than 500 characters', () => {
      const invalidData = {
        title: 'Test Task',
        description: 'a'.repeat(501)
      };
      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate partial updates', () => {
      const validUpdates = [
        { title: 'Updated Title' },
        { description: 'Updated Description' },
        { completed: true },
        { title: 'New Title', completed: false }
      ];

      validUpdates.forEach(update => {
        expect(() => updateTaskSchema.parse(update)).not.toThrow();
      });
    });

    it('should reject invalid updates', () => {
      const invalidUpdates = [
        { title: '' },
        { title: 'a'.repeat(101) },
        { description: 'a'.repeat(501) }
      ];

      invalidUpdates.forEach(update => {
        expect(() => updateTaskSchema.parse(update)).toThrow();
      });
    });
  });

  describe('taskIdSchema', () => {
    it('should validate positive integer IDs', () => {
      const validIds = [1, 42, 1000];
      validIds.forEach(id => {
        expect(() => taskIdSchema.parse({ id })).not.toThrow();
      });
    });

    it('should reject invalid IDs', () => {
      const invalidIds = [0, -1, 1.5, 'not-a-number'];
      invalidIds.forEach(id => {
        expect(() => taskIdSchema.parse({ id })).toThrow();
      });
    });
  });
}); 