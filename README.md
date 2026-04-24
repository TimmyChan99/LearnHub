# LearnHub

LearnHub is an AI-powered learning platform that generates custom courses tailored to your learning needs. Explore AI-generated curriculums, track your progress, and learn at your own pace.

<img width="1452" height="865" alt="image" src="https://github.com/user-attachments/assets/d98f5eef-e357-4d52-9c9c-66c4ab4e2911" />

## Features

- **AI Course Generation**: Generate custom courses by simply describing what you want to learn
- **Progress Tracking**: Monitor your learning journey with real-time progress indicators
- **Course Catalog**: Browse and explore all available courses
- **Chapter Management**: Learn through structured chapters with detailed content
- **User Authentication**: Secure sign-in and sign-up functionality
- **Dashboard**: View your learning statistics and active courses at a glance
- **Responsive Design**: Seamless experience on desktop and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Backend Integration**: Supabase (PostgreSQL database)
- **API Integration**: Fusion AI API for course generation
- **HTTP Client**: Fetch API

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Supabase Account** (for database)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/LearnHub.git
cd LearnHub
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase

#### Create Tables

Create the following tables in your Supabase database:

**courses table:**
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  level VARCHAR,
  duration VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**chapitres table:**
```sql
CREATE TABLE chapitres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content JSONB,
  status VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**users table (optional - if you want to store user progress):**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  enrolled_courses UUID[] DEFAULT '{}',
  progress JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Initialize Supabase Client

Create a `src/supabase.ts` file:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 6. API Configuration

Update the API endpoints in `src/App.tsx`:

```typescript
const BASE_URL_SIGN_IN = 'your_sign_in_endpoint';
const BASE_URL_SIGN_UP = 'your_sign_up_endpoint';
const COURSE_GENERATION_URL = 'your_course_generation_endpoint';
```

## Running the Application

### Development Mode

```bash
npm start
```

or

```bash
yarn start
```

The application will open at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

or

```bash
yarn build
```

## Project Structure

```
LearnHub/
├── src/
│   ├── components/
│   │   ├── Auth.tsx              # Authentication component
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── Catalog.tsx           # Course catalog
│   │   ├── CourseViewer.tsx      # Course content viewer
│   │   ├── CourseGenerator.tsx   # AI course generation
│   │   └── Layout.tsx            # Main layout wrapper
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main app component
│   ├── supabase.ts               # Supabase client config
│   └── index.tsx                 # React entry point
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## File Descriptions

### Key Components

- **Auth.tsx**: Handles user authentication (sign-in and sign-up)
- **Dashboard.tsx**: Displays user statistics and active courses
- **Catalog.tsx**: Shows all available courses with search/filter capabilities
- **CourseViewer.tsx**: Displays course content and chapter navigation
- **CourseGenerator.tsx**: Form for generating new AI courses
- **Layout.tsx**: Navigation and layout wrapper

### Core Files

- **App.tsx**: Main application logic, state management, and routing
- **types/index.ts**: TypeScript type definitions for User, Course, Chapter, etc.

## API Endpoints

### Authentication

- **Sign In**: `POST /auth/sign-in`
- **Sign Up**: `POST /auth/sign-up`

### Course Generation

- **Generate Course**: `POST /webhooks/webhook-szumbo1v862q3omhvcxxfyl1/course`
  - Request body: `{ title: string }`

### Chapter Management

- **Mark Chapter Complete**: `POST /webhooks/webhook-p2o8weuycaynh3bhnb2i3ab5/status`
  - Request body: `{ id: string }`

## Database Schema

### courses
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | String | Course title |
| description | Text | Course description |
| duration | String | Estimated duration |
| created_at | Timestamp | Creation date |
| updated_at | Timestamp | Last update date |

### chapitres
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| course_id | UUID | Foreign key to courses |
| title | String | Chapter title |
| content | JSON | Chapter content |
| status | String | Chapter status |
| created_at | Timestamp | Creation date |
| updated_at | Timestamp | Last update date |

## Features Walkthrough

### 1. Authentication
- Users can sign up with email and password
- Existing users can sign in
- Error messages displayed for failed attempts

### 2. Dashboard
- Welcome message with user name
- Overall progress percentage
- List of all available courses
- Quick access to continue learning

### 3. Course Catalog
- Browse all courses
- View course metadata (level, duration, chapters)
- Click to view course details

### 4. Course Generation
- Input a topic or learning goal
- AI generates a custom curriculum
- Course is automatically saved to database
- User is redirected to dashboard

### 5. Course Viewer
- Navigate through chapters
- Track progress visually
- Mark chapters as completed
- Move to next chapter seamlessly

## State Management

LearnHub uses React hooks for state management:

- `useState`: For local component state
- `useEffect`: For side effects and data fetching
- Context can be added for global state if needed

## Error Handling

The application includes error handling for:

- API request failures
- Authentication errors
- Database query errors
- Missing data (courses, chapters)

Errors are logged to the console and displayed to users where appropriate.

## Styling

The application uses **Tailwind CSS** for styling with:

- Custom color scheme (indigo as primary color)
- Responsive grid layouts
- Smooth transitions and animations
- Accessible components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Issue: "Objects are not valid as a React child"
**Solution**: Ensure chapter content is accessed correctly (e.g., `chapter.content`, not the entire `chapter` object).

### Issue: Catalog component not rendering
**Solution**: Check that `currentPage === 'catalog'` in App.tsx and the Catalog component is imported correctly.

### Issue: Supabase queries returning empty
**Solution**: Verify table names match exactly (case-sensitive) and foreign keys are properly set.

### Issue: API requests failing
**Solution**: Check CORS settings and ensure API endpoints are correct and accessible.

## Performance Optimization

- Lazy loading for course lists
- Memoized components to prevent unnecessary re-renders
- Efficient database queries with proper indexing
- Optimized images and assets

## Security

- Environment variables for sensitive data
- CORS proxy for API requests
- Input validation on forms
- Secure authentication flow

## Future Enhancements

- [ ] User profiles and preference management
- [ ] Course ratings and reviews
- [ ] Discussion forums
- [ ] Certificates on completion
- [ ] Video lessons integration
- [ ] Offline mode
- [ ] Social sharing features
- [ ] Advanced search and filtering
- [ ] Recommendation engine
- [ ] Mobile app (React Native)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fusion AI API for course generation
- Supabase for database infrastructure
- Tailwind CSS for styling framework
- Lucide React for icons

---

**Made with ❤️ by the LearnHub Team**
