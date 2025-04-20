// This file contains setup code for Jest tests

// Set test timeout (5 seconds)
jest.setTimeout(5000);

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment to suppress specific console methods during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Add custom matchers if needed
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global setup before all tests
beforeAll(() => {
  // Setup code that runs once before all tests
  process.env.NODE_ENV = 'test';
});

// Global teardown after all tests
afterAll(() => {
  // Cleanup code that runs once after all tests
});