export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

// Mock database
const polls: Poll[] = [
  {
    id: '1',
    question: 'What is your favorite programming language?',
    options: [
      { id: 1, text: 'JavaScript', votes: 5 },
      { id: 2, text: 'Python', votes: 12 },
      { id: 3, text: 'Rust', votes: 8 },
      { id: 4, text: 'Go', votes: 3 },
    ],
  },
];

// Simulate random vote increases
setInterval(() => {
  const poll = polls[0];
  const randomOptionIndex = Math.floor(Math.random() * poll.options.length);
  poll.options[randomOptionIndex].votes++;
}, 2000);


// --- Data Access Functions ---

// Fetches the static poll data (question, options)
export const getPoll = async (id: string): Promise<Poll | undefined> => {
  console.log('Fetching poll structure...');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const poll = polls.find((p) => p.id === id);
  if (!poll) return undefined;
  // Return a copy to avoid direct mutation issues in a real app
  return { ...poll, options: poll.options.map(opt => ({...opt})) };
};

// Fetches only the latest results
export const getPollResults = async (id: string): Promise<PollOption[] | undefined> => {
  console.log('Fetching latest poll results...');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a slower network delay for results
  const poll = polls.find((p) => p.id === id);
  return poll?.options.map(opt => ({...opt}));
};