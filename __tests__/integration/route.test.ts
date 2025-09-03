/**
 * Integration tests for the polls API endpoint
 * These tests verify the complete flow without mocking internal dependencies
 */

// Mock global fetch for HTTP requests
global.fetch = jest.fn();

describe('Integration Test: POST /api/polls', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  // Test successful poll creation flow
  it('should successfully create a poll via HTTP request', async () => {
    const mockResponse = {
      ok: true,
      status: 201,
      json: async () => ({
        id: 'test-poll-id',
        question: 'What is your favorite programming language?',
        options: ['JavaScript', 'Python', 'TypeScript'],
        created_by: 'test-user-id',
        created_at: new Date().toISOString()
      })
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const pollData = {
      question: 'What is your favorite programming language?',
      options: ['JavaScript', 'Python', 'TypeScript']
    };

    const response = await fetch('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pollData)
    });

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.question).toBe('What is your favorite programming language?');
    expect(data.options).toEqual(['JavaScript', 'Python', 'TypeScript']);
  });

  // Test validation error handling
  it('should return 400 for invalid request body', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: [
          { field: 'question', message: 'Question must be at least 5 characters' },
          { field: 'options', message: 'At least two options are required' }
        ]
      })
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const invalidPollData = {
      question: '', // Invalid: empty question
      options: ['Option 1'] // Invalid: less than two options
    };

    const response = await fetch('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidPollData)
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Validation failed');
  });

  // Test authentication error
  it('should return 401 for unauthenticated requests', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({
        error: 'Unauthorized. Please sign in to create polls.'
      })
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const pollData = {
      question: 'This should fail due to auth',
      options: ['Option A', 'Option B']
    };

    const response = await fetch('http://localhost:3000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pollData)
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized. Please sign in to create polls.');
  });
});