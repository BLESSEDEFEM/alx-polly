# ALX Polly: Complete Project Textbook

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Configuration Files](#configuration-files)
5. [Database Design](#database-design)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Authentication System](#authentication-system)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Configuration](#deployment-configuration)
11. [Development Workflow](#development-workflow)
12. [Security Considerations](#security-considerations)

---

## Project Overview

### What is ALX Polly?

ALX Polly is a modern, full-stack polling application that allows users to create, share, and participate in polls. The application supports both authenticated and anonymous voting, real-time results, and comprehensive poll management features.

### Key Features

- **Poll Creation**: Users can create polls with multiple options (2-10 options)
- **Voting System**: Supports both authenticated and anonymous voting
- **Real-time Results**: Live poll results with vote counts
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Poll Management**: Users can edit and delete their own polls
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Data Validation**: Comprehensive input validation on both client and server
- **Security**: Row-level security, duplicate vote prevention, and input sanitization

### Project Goals

This project demonstrates:
- Modern web development practices
- Full-stack TypeScript development
- Database design and management
- Authentication and authorization
- API design and implementation
- Testing strategies
- Security best practices

---

## Technology Stack

### Frontend Technologies

#### Next.js 14 (App Router)
**Purpose**: React framework for production-ready applications
**Why chosen**: 
- Server-side rendering (SSR) for better SEO
- App Router for modern routing patterns
- Built-in API routes
- Excellent TypeScript support
- Automatic code splitting

#### React 18
**Purpose**: UI library for building user interfaces
**Why chosen**:
- Component-based architecture
- Hooks for state management
- Large ecosystem and community
- Excellent performance with concurrent features

#### TypeScript
**Purpose**: Type-safe JavaScript development
**Why chosen**:
- Compile-time error detection
- Better IDE support and autocomplete
- Improved code maintainability
- Enhanced developer experience

#### TailwindCSS
**Purpose**: Utility-first CSS framework
**Why chosen**:
- Rapid UI development
- Consistent design system
- Small bundle size (purged unused styles)
- Responsive design utilities
- Dark mode support

#### Shadcn/ui
**Purpose**: Pre-built, accessible UI components
**Why chosen**:
- Accessibility-first components
- Customizable with TailwindCSS
- TypeScript support
- Consistent design patterns

### Backend Technologies

#### Supabase
**Purpose**: Backend-as-a-Service (BaaS)
**Why chosen**:
- PostgreSQL database with real-time features
- Built-in authentication system
- Row-level security (RLS)
- Auto-generated APIs
- Real-time subscriptions

#### Zod
**Purpose**: Schema validation library
**Why chosen**:
- TypeScript-first validation
- Runtime type checking
- Excellent error messages
- Integration with form libraries

### Development Tools

#### Jest
**Purpose**: JavaScript testing framework
**Why chosen**:
- Comprehensive testing features
- Snapshot testing
- Mocking capabilities
- TypeScript support

#### ESLint
**Purpose**: Code linting and formatting
**Why chosen**:
- Code quality enforcement
- Consistent coding standards
- Integration with Next.js

---

## Project Architecture

### Folder Structure Explanation

```
alx-polly/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes (backend endpoints)
│   ├── auth/              # Authentication pages
│   ├── create-poll/       # Poll creation page
│   ├── dashboard/         # User dashboard
│   ├── polls/             # Poll viewing and management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (navbar, footer)
│   ├── polls/             # Poll-specific components
│   └── ui/                # Base UI components (buttons, inputs)
├── contexts/              # React Context providers
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   └── supabase/          # Supabase client configurations
├── supabase/              # Database migrations and schemas
├── __tests__/             # Test files
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
└── Configuration files    # Package.json, tsconfig, etc.
```

### Architecture Patterns

#### 1. **Separation of Concerns**
- **Frontend**: React components handle UI and user interactions
- **Backend**: API routes handle business logic and data operations
- **Database**: Supabase manages data persistence and relationships

#### 2. **Component-Based Architecture**
- Reusable UI components in `/components/ui/`
- Feature-specific components in respective directories
- Higher-order components for layout and authentication

#### 3. **API-First Design**
- RESTful API endpoints in `/app/api/`
- Consistent request/response patterns
- Comprehensive error handling

#### 4. **Type-Safe Development**
- TypeScript throughout the entire stack
- Zod schemas for runtime validation
- Type definitions for all data structures

---

## Configuration Files

### package.json
**Purpose**: Project metadata and dependency management

```json
{
  "name": "alx-polly",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",        // Development server
    "build": "next build",    // Production build
    "start": "next start",    // Production server
    "lint": "next lint",      // Code linting
    "test": "jest"            // Run tests
  }
}
```

**Key Dependencies Explained**:

- **@supabase/supabase-js**: Main Supabase client library
- **@supabase/ssr**: Server-side rendering support for Supabase
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Integration between react-hook-form and Zod
- **zod**: Schema validation library
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for creating variant-based component APIs
- **tailwind-merge**: Utility for merging Tailwind classes

### tsconfig.json
**Purpose**: TypeScript compiler configuration

```json
{
  "compilerOptions": {
    "target": "esnext",           // Latest JavaScript features
    "lib": ["dom", "esnext"],    // Include DOM and latest JS APIs
    "strict": true,              // Enable all strict type checking
    "baseUrl": ".",              // Base directory for module resolution
    "paths": {                   // Path mapping for imports
      "@/*": ["./*"],
      "@/app/*": ["./app/*"],
      "@/components/*": ["./components/*"]
    }
  }
}
```

**Why these settings**:
- **strict: true**: Catches more potential errors at compile time
- **Path mapping**: Enables clean imports like `@/components/ui/button`
- **esnext target**: Uses latest JavaScript features for better performance

### next.config.js
**Purpose**: Next.js framework configuration

```javascript
const nextConfig = {
  reactStrictMode: true,    // Enable React strict mode for better debugging
  swcMinify: true,         // Use SWC for faster minification
  output: 'standalone',    // Optimize for deployment
}
```

### tailwind.config.js
**Purpose**: TailwindCSS configuration and customization

**Key sections**:
- **Content paths**: Tells Tailwind which files to scan for classes
- **Theme extension**: Custom colors, spacing, and design tokens
- **Plugins**: Additional functionality like animations

### jest.config.js
**Purpose**: Testing framework configuration

**Key features**:
- **Multiple test environments**: Node.js for unit tests, jsdom for integration
- **Path mapping**: Same aliases as TypeScript configuration
- **Setup files**: Global test configuration and mocks

---

## Database Design

### Database Schema

The application uses PostgreSQL through Supabase with two main tables:

#### 1. Polls Table

```sql
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Field Explanations**:
- **id**: Unique identifier using UUID for security and scalability
- **question**: The poll question (validated: 5-160 characters)
- **options**: Array of poll options (validated: 2-10 options, each 1-50 characters)
- **created_by**: Foreign key to auth.users table
- **created_at**: Automatic timestamp for creation time
- **expires_at**: Optional expiration date for polls
- **updated_at**: Timestamp for last modification

#### 2. Votes Table

```sql
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints for data integrity
  CONSTRAINT votes_user_or_ip_check CHECK (
    (user_id IS NOT NULL AND ip_address IS NULL) OR 
    (user_id IS NULL AND ip_address IS NOT NULL)
  ),
  CONSTRAINT votes_user_unique UNIQUE (poll_id, user_id),
  CONSTRAINT votes_ip_unique UNIQUE (poll_id, ip_address)
);
```

**Field Explanations**:
- **poll_id**: References the poll being voted on
- **user_id**: For authenticated users (nullable for anonymous votes)
- **ip_address**: For anonymous users (nullable for authenticated votes)
- **option_index**: Index of the selected option (0-based)
- **created_at**: Timestamp of the vote

**Constraints Explained**:
- **votes_user_or_ip_check**: Ensures either user_id OR ip_address is provided
- **votes_user_unique**: Prevents duplicate votes from same authenticated user
- **votes_ip_unique**: Prevents duplicate votes from same IP address

### Row Level Security (RLS)

Supabase's RLS provides fine-grained access control:

#### Polls Table Policies
```sql
-- Anyone can view polls
CREATE POLICY "Anyone can view polls" ON polls 
  FOR SELECT USING (true);

-- Users can create polls
CREATE POLICY "Users can create polls" ON polls 
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own polls
CREATE POLICY "Users can update their own polls" ON polls 
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own polls
CREATE POLICY "Users can delete their own polls" ON polls 
  FOR DELETE USING (auth.uid() = created_by);
```

#### Votes Table Policies
```sql
-- Anyone can insert votes (authenticated and anonymous)
CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Anyone can read votes (for displaying results)
CREATE POLICY "Anyone can read votes" ON votes
  FOR SELECT USING (true);

-- Users can update/delete their own votes
CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE USING (auth.uid() = user_id);
```

### Database Relationships

1. **One-to-Many**: Users → Polls (one user can create many polls)
2. **One-to-Many**: Polls → Votes (one poll can have many votes)
3. **Many-to-One**: Votes → Users (many votes can belong to one user)

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_ip_address ON votes(ip_address);
CREATE INDEX idx_votes_created_at ON votes(created_at);
```

**Why these indexes**:
- **poll_id**: Fast lookup of votes for a specific poll
- **user_id**: Quick duplicate vote checking for authenticated users
- **ip_address**: Quick duplicate vote checking for anonymous users
- **created_at**: Efficient sorting and filtering by date

---

## Backend Implementation

### API Architecture

The backend follows RESTful principles with the following endpoints:

```
GET    /api/polls           # List all polls
POST   /api/polls           # Create a new poll
PUT    /api/polls           # Update a poll
DELETE /api/polls           # Delete a poll
GET    /api/polls/[id]      # Get specific poll
POST   /api/polls/[id]/vote # Vote on a poll
GET    /api/polls/[id]/vote # Get poll results
```

### Main Polls API Route (/api/polls/route.ts)

#### Validation Schema

```typescript
const pollSchema = z.object({
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(160, 'Question must not be longer than 160 characters')
    .transform(v => v.trim()),
  options: z
    .array(
      z.string()
        .min(1, 'Option cannot be empty')
        .max(50, 'Option must not be longer than 50 characters')
        .transform(v => v.trim())
    )
    .min(2, 'At least two options are required')
    .max(10, 'You can add at most 10 options')
    .refine(opts => new Set(opts).size === opts.length, {
      message: 'Options must be unique'
    }),
  expiresAt: z.preprocess(
    (val) => {
      if (!val || val === '') return null;
      const date = new Date(val as string);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString();
    },
    z.string().nullable().optional()
  ),
});
```

**Validation Features**:
- **String trimming**: Removes whitespace automatically
- **Length validation**: Ensures reasonable content length
- **Array validation**: Checks option count and uniqueness
- **Date preprocessing**: Handles optional expiration dates
- **Custom refinements**: Additional business logic validation

#### Authentication Helper

```typescript
async function authenticateUser(supabase: SupabaseClient): Promise<AuthResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    };
  }
  
  return { user, error: null };
}
```

**Why this pattern**:
- **Consistent error handling**: Standardized authentication responses
- **Type safety**: Clear return type with user or error
- **Reusability**: Used across multiple API endpoints

#### POST Handler (Create Poll)

```typescript
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { question, options, expiresAt } = pollSchema.parse(body);
    
    // 2. Create Supabase client
    const supabase = createSupabaseClient();
    
    // 3. Authenticate user
    const { user, error: authError } = await authenticateUser(supabase);
    if (authError) return authError;
    
    // 4. Prepare poll data
    const pollData = preparePollData(question, options, expiresAt, user.id);
    
    // 5. Insert into database
    const { data, error } = await supabase
      .from('polls')
      .insert(pollData)
      .select()
      .single();
    
    if (error) throw error;
    
    // 6. Return success response
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    // Handle validation and unexpected errors
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    return handleUnexpectedError(error, 'POST /api/polls');
  }
}
```

**Flow Explanation**:
1. **Input validation**: Zod schema ensures data integrity
2. **Authentication**: Verify user is logged in
3. **Data preparation**: Format data for database insertion
4. **Database operation**: Insert poll with error handling
5. **Response**: Return created poll or error

### Vote Handling API (/api/polls/[id]/vote/route.ts)

#### Vote Validation

```typescript
const voteSchema = z.object({
  optionIndex: z.number().min(0, 'Invalid option index'),
});
```

#### POST Handler (Submit Vote)

```typescript
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Validate input
    const body = await request.json();
    const { optionIndex } = voteSchema.parse(body);
    
    // 2. Get user (optional for anonymous voting)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;
    
    // 3. Verify poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, options, expires_at')
      .eq('id', pollId)
      .single();
    
    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }
    
    // 4. Check poll expiration
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This poll has expired' }, { status: 400 });
    }
    
    // 5. Validate option index
    if (optionIndex >= poll.options.length) {
      return NextResponse.json({ error: 'Invalid option selected' }, { status: 400 });
    }
    
    // 6. Check for duplicate votes
    if (userId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();
      
      if (existingVote) {
        return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 400 });
      }
    }
    
    // 7. Get client IP for anonymous voting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // 8. Insert vote
    const voteData = {
      poll_id: pollId,
      user_id: userId,
      ip_address: userId ? null : clientIp,
      option_index: optionIndex
    };
    
    const { error: voteError } = await supabase
      .from('votes')
      .insert(voteData);
    
    if (voteError) throw voteError;
    
    return NextResponse.json({ success: true }, { status: 201 });
    
  } catch (error) {
    return handleUnexpectedError(error, 'POST /api/polls/[id]/vote');
  }
}
```

**Security Features**:
- **Duplicate prevention**: Checks for existing votes by user or IP
- **Poll validation**: Ensures poll exists and is active
- **Option validation**: Verifies selected option is valid
- **IP tracking**: Enables anonymous voting while preventing abuse

### Error Handling Strategy

#### Validation Error Handler

```typescript
function handleValidationError(error: z.ZodError): NextResponse {
  const errorMessages = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
  
  return NextResponse.json(
    { 
      error: 'Validation failed', 
      details: errorMessages 
    }, 
    { status: 400 }
  );
}
```

#### Unexpected Error Handler

```typescript
function handleUnexpectedError(error: unknown, context: string): NextResponse {
  console.error(`${context}:`, error);
  return NextResponse.json(
    { error: 'Internal Server Error' }, 
    { status: 500 }
  );
}
```

**Error Handling Principles**:
- **Consistent format**: All errors follow same response structure
- **Appropriate status codes**: HTTP status codes match error types
- **Security**: Don't expose internal error details to clients
- **Logging**: Server-side logging for debugging

---

## Frontend Implementation

### Component Architecture

The frontend follows a hierarchical component structure:

```
App Layout (layout.tsx)
├── Navbar (components/layout/navbar.tsx)
├── Page Content
│   ├── UI Components (components/ui/)
│   ├── Feature Components (components/polls/, components/auth/)
│   └── Page-specific Components
└── Footer
```

### Root Layout (app/layout.tsx)

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-4 text-center text-sm text-muted-foreground">
              <div className="container mx-auto">
                © {new Date().getFullYear()} Alx Polly. All rights reserved.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Layout Features**:
- **AuthProvider**: Wraps entire app for authentication context
- **Flexbox layout**: Ensures footer stays at bottom
- **Responsive container**: Centers content with proper spacing
- **Font optimization**: Uses Next.js font optimization

### Home Page (app/page.tsx)

**Key sections**:
1. **Hero Section**: Main branding and call-to-action
2. **Feature Cards**: Highlight key application features
3. **Responsive Design**: Mobile-first approach

```typescript
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
            ALX Polly
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            Create beautiful polls, gather insights, and make data-driven decisions
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/auth/signin">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/polls">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature cards with hover effects and gradients */}
        </div>
      </div>
    </div>
  )
}
```

**Design Principles**:
- **Visual hierarchy**: Clear typography scale and spacing
- **Progressive enhancement**: Works without JavaScript
- **Accessibility**: Semantic HTML and proper contrast
- **Performance**: Optimized images and minimal JavaScript

### Poll Form Component (components/polls/poll-form.tsx)

#### Form State Management

```typescript
const form = useForm<PollFormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    question: '',
    options: [{ value: '' }, { value: '' }],
    expiresAt: '',
  },
})

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: 'options',
})
```

**Form Features**:
- **React Hook Form**: Efficient form state management
- **Zod Integration**: Client-side validation matching server
- **Dynamic Fields**: Add/remove poll options dynamically
- **Error Handling**: Real-time validation feedback

#### Form Validation Schema

```typescript
const formSchema = z.object({
  question: z.string()
    .min(5, { message: 'Question must be at least 5 characters.' })
    .max(160, { message: 'Question must not be longer than 160 characters.' }),
  options: z.array(z.object({
    value: z.string()
      .min(1, { message: 'Option cannot be empty.' })
      .max(50, { message: 'Option must not be longer than 50 characters.' }),
  }))
    .min(2, { message: 'Please add at least 2 options.' })
    .max(10, { message: 'You can add at most 10 options.' }),
  expiresAt: z.string().optional(),
})
```

#### Dynamic Option Management

```typescript
{fields.map((field, index) => (
  <div key={field.id} className="flex items-center space-x-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold">
      {index + 1}
    </div>
    <Input
      {...form.register(`options.${index}.value`)}
      placeholder={`Option ${index + 1}`}
      className="flex-1"
    />
    {fields.length > 2 && (
      <Button
        type="button"
        onClick={() => remove(index)}
        variant="outline"
        size="sm"
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
))}
```

**UX Considerations**:
- **Visual feedback**: Numbered options for clarity
- **Minimum options**: Prevents removal below 2 options
- **Add/remove controls**: Intuitive option management
- **Validation feedback**: Real-time error messages

### UI Component System

The application uses a consistent design system built with Shadcn/ui:

#### Button Component (components/ui/button.tsx)

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Design System Benefits**:
- **Consistency**: All buttons follow same design patterns
- **Flexibility**: Multiple variants for different use cases
- **Accessibility**: Built-in focus states and ARIA support
- **Maintainability**: Centralized styling logic

---

## Authentication System

### Authentication Context (contexts/auth-context.tsx)

#### Context Definition

```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}
```

#### Provider Implementation

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: any) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error?.message }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })
    return { error: error?.message }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Context Benefits**:
- **Global state**: Authentication state available throughout app
- **Automatic updates**: Responds to auth state changes
- **Type safety**: TypeScript interfaces ensure correct usage
- **Error handling**: Consistent error response format

### Authentication Form (components/auth/user-auth-form.tsx)

#### Form Validation

```typescript
async function onSubmit(event: React.SyntheticEvent) {
  event.preventDefault()
  setIsLoading(true)
  setError('')

  const formData = new FormData(event.target as HTMLFormElement)
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const confirmPassword = formData.get('confirm-password') as string

  // Client-side validation
  if (!email || !password) {
    setError('Please fill in all required fields')
    setIsLoading(false)
    return
  }

  if (type === 'signup' && password !== confirmPassword) {
    setError('Passwords do not match')
    setIsLoading(false)
    return
  }

  try {
    let result
    if (type === 'signin') {
      result = await signIn(email, password)
    } else {
      result = await signUp(email, password, name)
    }

    if (result.error) {
      setError(result.error)
    } else {
      router.push(redirectTo)
    }
  } catch (error) {
    setError('An unexpected error occurred')
  } finally {
    setIsLoading(false)
  }
}
```

**Form Features**:
- **Dual mode**: Handles both sign-in and sign-up
- **Client validation**: Immediate feedback for common errors
- **Redirect handling**: Sends users to intended destination
- **Loading states**: Visual feedback during authentication

### Middleware Protection (middleware.ts)

```typescript
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const protectedRoutes = ['/create-poll', '/polls/create', '/polls', '/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect unauthenticated users
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from auth pages
  const authRoutes = ['/auth/signin', '/auth/signup']
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/polls', request.url))
  }

  return response
}
```

**Middleware Features**:
- **Route protection**: Blocks access to protected routes
- **Automatic redirects**: Sends users to appropriate pages
- **Session management**: Handles cookie-based sessions
- **Flexible configuration**: Easy to add/remove protected routes

---

## Testing Strategy

### Testing Architecture

The application uses a comprehensive testing strategy with multiple test types:

```
__tests__/
├── unit/                  # Unit tests for individual functions
│   ├── pollSchema.test.ts # Schema validation tests
│   └── route.test.ts      # API route unit tests
└── integration/           # Integration tests for complete flows
    └── route.test.ts      # End-to-end API tests
```

### Jest Configuration

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.ts'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.ts'],
      testEnvironment: 'jsdom',
    },
  ],
};
```

**Configuration Benefits**:
- **Multiple environments**: Node.js for unit tests, jsdom for integration
- **Path mapping**: Same aliases as main application
- **TypeScript support**: Seamless TypeScript testing
- **Project separation**: Clear distinction between test types

### Unit Tests (pollSchema.test.ts)

```typescript
describe('pollSchema validation', () => {
  it('should validate a poll with a question and at least two options', () => {
    const validPoll = {
      question: 'What is your favorite color?',
      options: ['Red', 'Blue', 'Green'],
    };
    expect(() => pollSchema.parse(validPoll)).not.toThrow();
  });

  it('should throw an error if the question is missing', () => {
    const invalidPoll = {
      question: '',
      options: ['Red', 'Blue'],
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow('Question is required');
  });

  it('should throw an error if there are less than two options', () => {
    const invalidPoll = {
      question: 'What is your favorite color?',
      options: ['Red'],
    };
    expect(() => pollSchema.parse(invalidPoll)).toThrow('At least two options are required');
  });
});
```

**Unit Test Principles**:
- **Single responsibility**: Each test focuses on one behavior
- **Clear naming**: Test names describe expected behavior
- **Edge cases**: Tests cover boundary conditions
- **Fast execution**: No external dependencies

### Integration Tests (route.test.ts)

```typescript
describe('Integration Test: POST /api/polls', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

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
});
```

**Integration Test Benefits**:
- **End-to-end validation**: Tests complete request/response cycle
- **Real-world scenarios**: Simulates actual API usage
- **Mock external dependencies**: Isolates application logic
- **HTTP-level testing**: Validates API contracts

### Testing Best Practices

1. **Test Pyramid**: More unit tests, fewer integration tests
2. **Arrange-Act-Assert**: Clear test structure
3. **Descriptive names**: Tests serve as documentation
4. **Independent tests**: No test dependencies
5. **Mock external services**: Reliable, fast tests

---

## Security Considerations

### Input Validation

#### Client-Side Validation
- **Zod schemas**: Type-safe validation with clear error messages
- **Form validation**: Real-time feedback prevents invalid submissions
- **Length limits**: Prevent excessively long inputs

#### Server-Side Validation
- **Duplicate validation**: Never trust client-side validation alone
- **Sanitization**: Trim whitespace and normalize inputs
- **Type checking**: Ensure data types match expectations

### Authentication Security

#### Supabase Auth Features
- **JWT tokens**: Secure, stateless authentication
- **Row Level Security**: Database-level access control
- **Session management**: Automatic token refresh
- **Password hashing**: Secure password storage

#### Middleware Protection
- **Route guards**: Prevent unauthorized access
- **Automatic redirects**: Seamless user experience
- **Session validation**: Verify tokens on each request

### Database Security

#### Row Level Security Policies
```sql
-- Users can only modify their own polls
CREATE POLICY "Users can update their own polls" ON polls 
  FOR UPDATE USING (auth.uid() = created_by);

-- Anyone can vote, but votes are tracked
CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);
```

#### Data Integrity
- **Foreign key constraints**: Maintain referential integrity
- **Check constraints**: Enforce business rules at database level
- **Unique constraints**: Prevent duplicate votes
- **NOT NULL constraints**: Ensure required fields

### API Security

#### Rate Limiting
- **Supabase built-in**: Automatic rate limiting
- **IP-based tracking**: Prevent abuse from anonymous users
- **User-based limits**: Prevent authenticated user abuse

#### Error Handling
- **No sensitive data**: Error messages don't expose internals
- **Consistent responses**: Standardized error format
- **Logging**: Server-side error tracking

### Frontend Security

#### XSS Prevention
- **React's built-in protection**: Automatic escaping
- **Sanitized inputs**: Clean user-provided content
- **Content Security Policy**: Prevent script injection

#### CSRF Protection
- **SameSite cookies**: Prevent cross-site requests
- **Origin validation**: Verify request sources
- **Supabase protection**: Built-in CSRF protection

---

## Deployment Configuration

### Production Build

```bash
npm run build    # Create optimized production build
npm run start    # Start production server
```

#### Build Optimizations
- **Code splitting**: Automatic bundle optimization
- **Tree shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Image optimization**: Next.js automatic image optimization

### Environment Variables

```env
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Deployment Platforms

#### Vercel (Recommended)
- **Zero configuration**: Automatic Next.js optimization
- **Edge functions**: Global performance
- **Automatic HTTPS**: SSL certificates
- **Preview deployments**: Test before production

#### Other Platforms
- **Netlify**: JAMstack deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

### Database Migration

```sql
-- Run in Supabase SQL editor
-- 1. Create polls table
-- 2. Create votes table
-- 3. Set up RLS policies
-- 4. Create indexes
```

---

## Development Workflow

### Getting Started

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd alx-polly
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Database Setup**
   - Create Supabase project
   - Run SQL migrations
   - Configure RLS policies

5. **Start Development**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
```

### Code Organization

#### File Naming Conventions
- **Components**: PascalCase (e.g., `PollForm.tsx`)
- **Pages**: kebab-case (e.g., `create-poll/page.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

#### Import Organization
```typescript
// 1. React and Next.js imports
import React from 'react'
import { NextResponse } from 'next/server'

// 2. Third-party libraries
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

// 4. Relative imports
import './styles.css'
```

### Git Workflow

1. **Feature Branches**
   ```bash
   git checkout -b feature/poll-creation
   git commit -m "feat: add poll creation form"
   git push origin feature/poll-creation
   ```

2. **Commit Messages**
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Adding tests

### Code Quality

#### ESLint Configuration
- **Next.js rules**: Framework-specific linting
- **TypeScript rules**: Type safety enforcement
- **React hooks rules**: Proper hook usage
- **Accessibility rules**: WCAG compliance

#### TypeScript Configuration
- **Strict mode**: Maximum type safety
- **Path mapping**: Clean import statements
- **Incremental compilation**: Faster builds

---

## Conclusion

This textbook has covered every aspect of the ALX Polly polling application, from the foundational concepts to the implementation details. The project demonstrates modern web development practices including:

- **Full-stack TypeScript development**
- **Modern React patterns with hooks and context**
- **Secure authentication and authorization**
- **Database design with proper relationships and constraints**
- **Comprehensive testing strategies**
- **Security best practices**
- **Performance optimization**
- **Deployment considerations**

By understanding these concepts and implementations, you should be able to build similar applications independently and extend this project with additional features.

### Next Steps for Learning

1. **Add new features**: Implement poll categories, comments, or sharing
2. **Improve performance**: Add caching, optimize queries
3. **Enhance security**: Implement additional rate limiting, audit logging
4. **Scale the application**: Add load balancing, CDN integration
5. **Mobile development**: Create React Native or PWA version

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

This comprehensive guide should serve as both a learning resource and a reference for building modern web applications with the technologies demonstrated in ALX Polly.