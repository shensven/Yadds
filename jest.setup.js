import { jest } from '@jest/globals';

jest.mock('byte-size', () => {
  return {
    byteSize: jest.fn(),
  };
});
