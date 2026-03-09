# Subscription Tracker with Smart Insights

Production-style full-stack starter using:

- Frontend: React (Vite), Tailwind CSS, Recharts, Axios, React Router, Zustand
- Backend: Node.js, Express, Prisma, node-cron, Nodemailer
- Database: PostgreSQL (works with Neon/Supabase)

## Project Structure

```text
.
├── backend
└── frontend
```

## 1. Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Update `.env`:

- `DATABASE_URL` -> your PostgreSQL URL
- `JWT_SECRET` -> secret for signing tokens (change in production)
- SMTP fields -> SendGrid/SMTP credentials if you want renewal emails

Run Prisma + server:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend runs on `http://localhost:4000`.

## 2. Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register (email, fullName, password)
- `POST /api/auth/login` - Login (email, password)

- `GET /api/health` (public)
- `GET /api/subscriptions` (protected)
- `POST /api/subscriptions`
- `PUT /api/subscriptions/:id`
- `DELETE /api/subscriptions/:id`
- `PATCH /api/subscriptions/budget`
- `GET /api/insights`

## Features Included

- Subscription CRUD
- Monthly/Yearly billing normalization
- Budget limit tracking
- Category spending analytics (Recharts)
- **Authentication** - Login/Register with JWT
- Daily reminder cron job for upcoming renewals (3 days window)
- Email reminder integration via SMTP

## Deployment

### Backend (Render)

- Create a new Web Service from `backend`
- Add environment variables from `.env`
- Build command: `npm install && npx prisma generate`
- Start command: `npm start`
- Add a post-deploy migration step: `npx prisma migrate deploy`

### Database (Neon/Supabase)

- Create Postgres database
- Copy connection string to backend `DATABASE_URL`

### Frontend (Vercel)

- Import `frontend` directory as project root
- Set `VITE_API_URL` to your deployed backend URL + `/api`

## Notes

- Users must register or log in to access the dashboard and manage subscriptions.
- JWT tokens are stored in localStorage and sent with API requests.
