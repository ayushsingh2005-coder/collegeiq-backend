# CollegeIQ — Backend

REST API server for the CollegeIQ college discovery platform. Built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Railway)
- **Auth**: JWT + bcryptjs

## Project Structure
backend/
├── src/
│   ├── index.ts          # Entry point, Express app setup
│   ├── db.ts             # PostgreSQL connection + schema init
│   ├── seed.ts           # Database seeder (1000+ colleges)
│   ├── middleware/
│   │   └── auth.ts       # JWT authentication middleware
│   └── routes/
│       ├── colleges.ts   # College listing, search, filters, detail
│       ├── auth.ts       # Register and login
│       ├── saved.ts      # Save/unsave colleges (protected)
│       └── predictor.ts  # Rank-based college predictor
├── .env                  # Environment variables (not committed)
├── .env.example          # Example env file
├── package.json
└── tsconfig.json

## API Endpoints

### Colleges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges with filters and pagination |
| GET | `/api/colleges/:id` | Get single college detail |

**Query parameters for `/api/colleges`:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by college name |
| `location` | string | Filter by city or state |
| `course` | string | Filter by course offered |
| `maxFees` | number | Maximum annual fees |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 9) |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and receive JWT token |

### Saved Colleges (Protected — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved` | Get all saved colleges for logged-in user |
| POST | `/api/saved/:id` | Save a college |
| DELETE | `/api/saved/:id` | Remove a saved college |

### Predictor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictor` | Get college recommendations based on exam and rank |

**Query parameters for `/api/predictor`:**
| Param | Type | Description |
|-------|------|-------------|
| `exam` | string | `jee_main`, `jee_advanced`, `cuet`, `other` |
| `rank` | number | Your entrance exam rank |
| `course` | string | (Optional) Preferred course |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Returns server status |

## Database Schema

```sql
CREATE TABLE colleges (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(255) NOT NULL,
  location             VARCHAR(255) NOT NULL,
  fees                 INTEGER NOT NULL,
  rating               DECIMAL(3,1) NOT NULL,
  courses              TEXT[] NOT NULL,
  placement_percentage INTEGER,
  overview             TEXT,
  created_at           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_colleges (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
  UNIQUE(user_id, college_id)
);
```

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)

### Steps

```bash
# Clone the repository
git clone https://github.com/ayushsingh2005-coder/collegeiq-backend.git
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Seed the database with 1000+ colleges
npm run seed
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=4000
```

## Deployment

The backend is deployed on **Railway** with automatic deploys on every push to the `main` branch.

```bash
# Production build
npm run build

# Start production server
npm start
```

## Predictor Logic

The predictor maps entrance exam ranks to college tiers based on minimum rating, placement percentage, and maximum fees thresholds.

| Exam | Rank | Tier |
|------|------|------|
| JEE Advanced | ≤ 500 | IIT tier (rating ≥ 4.7, placement ≥ 95%) |
| JEE Advanced | ≤ 2000 | Top IIT/IIIT tier (rating ≥ 4.5, placement ≥ 90%) |
| JEE Advanced | ≤ 5000 | NIT/IIIT tier (rating ≥ 4.2, placement ≥ 85%) |
| JEE Main | ≤ 1000 | Top NIT/IIIT tier (rating ≥ 4.5, placement ≥ 90%) |
| JEE Main | ≤ 10,000 | NIT/State colleges (rating ≥ 4.2, placement ≥ 85%) |
| JEE Main | ≤ 50,000 | Good private colleges (rating ≥ 4.0, placement ≥ 78%) |
| JEE Main | > 50,000 | All colleges |

Results are sorted by rating and placement percentage in descending order, returning the top 10 matches.