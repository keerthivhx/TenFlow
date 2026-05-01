# Team Task Manager

A full-stack, role-based project and task management web application built with Next.js (App Router), Prisma, and PostgreSQL.

## 🚀 Features
- **Authentication**: JWT-based secure signup/login.
- **Role-Based Access**: Admins can create projects and tasks. Members can update statuses.
- **Project & Team Management**: Group tasks into projects.
- **Dashboard**: Track total tasks, overdue tasks, and task statuses.
- **Modern UI**: Dark mode, glassmorphism, responsive design with smooth animations.

## 🛠 Tech Stack
- **Framework:** Next.js 14
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Vanilla CSS (Modern SaaS aesthetics)

## 🌐 Railway Deployment (Mandatory)

Follow these steps to deploy the application on Railway:

1. **Push to GitHub**:
   Push this repository to a GitHub account.

2. **Create Railway Project**:
   - Go to [Railway.app](https://railway.app/).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your repository.

3. **Provision Database**:
   - In your new Railway project, click **New** -> **Database** -> **Add PostgreSQL**.
   - Railway will automatically provision a Postgres database.

4. **Environment Variables**:
   Go to your Next.js service settings in Railway -> **Variables** and add:
   - `DATABASE_URL`: Set this to `${{Postgres.DATABASE_URL}}` (Railway handles this automatically if you reference the database service).
   - `NEXTAUTH_SECRET`: Add a strong random string (e.g., generate one using `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: The public URL of your Railway app (e.g., `https://your-app.up.railway.app`).

5. **Deploy**:
   Railway will automatically run `npm install`, then `npm run build` (which generates the Prisma client and builds Next.js), and finally `npm start`.

---
## 🏃‍♂️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   NEXTAUTH_SECRET="secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Run migrations and start the dev server:
   ```bash
   npx prisma db push
   npm run dev
   ```

## Demo
Please record a 2-5 min demo video showcasing the Authentication, Dashboard, and Project Boards and submit it along with the live Railway URL.
