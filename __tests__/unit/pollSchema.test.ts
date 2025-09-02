import { z } from 'zod';

const pollSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least two options are required'),
});

describe('pollSchema validation', () => {
  // Happy path test
  it('should validate a poll with a question and at least two options', () => {
    const validPoll = {
      question: 'What is your favorite color?',
      options: ['Red', 'Blue', 'Green'],
    };
    expect(() => pollSchema.parse(validPoll)).not.toThrow();
  });

  // Edge/failure case: Missing question
  it('should throw an error if the question is missing', () => {
    const invalidPoll = {
      question: '',
      options: ['Red', 'Blue'],
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow('Question is required');
  });

  // Edge/failure case: Less than two options
  it('should throw an error if there are less than two options', () => {
    const invalidPoll = {
      question: 'What is your favorite color?',
      options: ['Red'],
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow('At least two options are required');
  });

  // Edge/failure case: Empty option
  it('should throw an error if an option is empty', () => {
    const invalidPoll = {
      question: 'What is your favorite color?',
      options: ['Red', ''],
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow('Option cannot be empty');
  });

  // Edge/failure case: Options not an array
  it('should throw an error if options is not an array', () => {
    const invalidPoll = {
      question: 'What is your favorite color?',
      options: 'Red, Blue',
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow();
  });
});