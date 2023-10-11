export class MockUtils {
  static mockModelValue = (value: any) => ({
    new: jest.fn().mockResolvedValue(value),
    constructor: jest.fn().mockResolvedValue(value),
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  });
}
