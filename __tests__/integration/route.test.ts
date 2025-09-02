import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { POST } from '../../app/api/polls/route';

// Mock Supabase client for integration test to avoid actual database interaction
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [{ id: 'test-poll-id', question: 'Integration Test Question', options: ['Option A', 'Option B'] }], error: null }))
      }))
    }))
  }))
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({}))
}));

describe('Integration Test: POST /api/polls', () => {
  // Happy path integration test
  it('should successfully create a poll via the API route', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        question: 'What is your favorite programming language?',
        options: ['JavaScript', 'Python', 'TypeScript'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.question).toBe('Integration Test Question');
    expect(data.options).toEqual(['Option A', 'Option B']);
  });

  // Edge/failure case: Invalid request body for integration test
  it('should return 400 for invalid request body', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        question: '', // Invalid: empty question
        options: ['Option 1'], // Invalid: less than two options
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  // Edge/failure case: Supabase error during insertion
  it('should return 500 if Supabase insertion fails during integration test', async () => {
    (createRouteHandlerClient as jest.Mock).mockImplementationOnce(() => ({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
      },
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Supabase insertion failed' } }))
        }))
      }))
    }));

    const mockRequest = {
      json: () => Promise.resolve({
        question: 'This is a test question for failure.',
        options: ['Option X', 'Option Y'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Supabase insertion failed');
  });
});