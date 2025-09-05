# ALX Polly - Polling App with QR Code Sharing

A modern, full-stack polling application built with Next.js, Supabase, and TailwindCSS. Create polls, share them via unique URLs, and view real-time results with beautiful visualizations.

## 🚀 Features

- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Poll Creation**: Create polls with multiple options and optional expiration dates
- **Real-time Voting**: Vote on polls with instant result updates
- **Anonymous Voting**: Support for both authenticated and anonymous voting
- **User Dashboard**: Manage your polls and view performance analytics
- **Responsive Design**: Beautiful UI that works on all devices
- **QR Code Sharing**: Share polls easily with QR codes (planned feature)
- **Admin Panel**: Administrative interface for poll management

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.io/) account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd alx-polly
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project in [Supabase](https://supabase.io/)
2. Go to Settings > API to get your project URL and anon key
3. Set up the database schema by running the following SQL in the Supabase SQL editor:

```sql
-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls
CREATE POLICY "Anyone can view polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Users can create polls" ON polls FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own polls" ON polls FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own polls" ON polls FOR DELETE USING (auth.uid() = created_by);

-- Create policies for votes
CREATE POLICY "Anyone can view votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can create votes" ON votes FOR INSERT WITH CHECK (true);
```

### 4. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage Examples

### Creating a Poll

1. Sign up or sign in to your account
2. Navigate to "Create Poll" from the navigation menu
3. Enter your poll question
4. Add multiple options (minimum 2 required)
5. Optionally set an expiration date
6. Click "Create Poll" to publish

### Voting on a Poll

1. Visit any poll URL (authentication optional)
2. Select your preferred option
3. Click "Vote" to submit
4. View real-time results immediately

### Managing Your Polls

1. Go to your Dashboard after signing in
2. View all your created polls
3. Edit poll details or delete polls
4. Monitor voting statistics and engagement

## 🏗️ Project Structure

```
alx-polly/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── polls/         # Poll-related API endpoints
│   ├── auth/              # Authentication pages
│   ├── create/            # Poll creation page
│   ├── dashboard/         # User dashboard
│   ├── polls/             # Poll pages and listings
│   └── lib/               # Shared utilities and actions
│       ├── actions/       # Server actions
│       └── context/       # React contexts
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── polls/             # Poll-related components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   └── supabase/          # Supabase client configuration
└── public/                # Static assets
```

## 🧪 Testing

### Running Tests

```bash
npm run test
# or
yarn test
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Poll creation with various options
- [ ] Voting (both authenticated and anonymous)
- [ ] Poll editing and deletion
- [ ] Dashboard functionality
- [ ] Responsive design on different screen sizes
- [ ] Error handling and validation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Deploy to Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:

- [Netlify](https://netlify.com/)
- [Railway](https://railway.app/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)

## 🔒 Security

This application implements several security best practices:

- Row Level Security (RLS) with Supabase
- Input validation with Zod schemas
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure authentication flows

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue if you can't find an answer
3. Provide detailed information about your problem

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.io/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Happy Polling! 🗳️**