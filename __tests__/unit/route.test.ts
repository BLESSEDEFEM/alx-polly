import { POST } from '../../app/api/polls/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock the Supabase client and cookies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [{ id: 'test-poll-id', question: 'Test Question', options: ['Option 1', 'Option 2'] }], error: null }))
      }))
    }))
  }))
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({}))
}));

describe('POST /api/polls', () => {
  // Happy path test
  it('should create a new poll successfully', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        question: 'What is your favorite food?',
        options: ['Pizza', 'Pasta', 'Sushi'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      id: 'test-poll-id',
      question: 'Test Question',
      options: ['Option 1', 'Option 2'],
    });
  });

  // Edge/failure case: Invalid input (missing question)
  it('should return 400 if question is missing', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        question: '',
        options: ['Pizza', 'Pasta'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error[0].message).toBe('Question is required');
  });

  // Edge/failure case: Invalid input (less than two options)
  it('should return 400 if less than two options are provided', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        question: 'What is your favorite food?',
        options: ['Pizza'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error[0].message).toBe('At least two options are required');
  });

  // Edge/failure case: Supabase error
  it('should return 500 if Supabase insertion fails', async () => {
    (createRouteHandlerClient as jest.Mock).mockImplementationOnce(() => ({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } } }))
      },
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } }))
        }))
      }))
    }));

    const mockRequest = {
      json: () => Promise.resolve({
        question: 'What is your favorite food?',
        options: ['Pizza', 'Pasta'],
      }),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database error');
  });
});