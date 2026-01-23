# Nexus Project Management

## 🚀 Project Description
**Nexus** is a full-stack project management application built with **React + TypeScript (Frontend)** and **Node.js + Express + MongoDB (Backend)**. Designed for teams to manage projects, users, and invitations with role-based access control.

## 🎯 Objectives & Purpose
- **Project Management**: Create, edit, soft-delete projects with status tracking (Active/Archived/Deleted)
- **User Management**: Admin-only user management with role-based permissions (Admin/Manager/Staff)
- **Invitation System**: Secure invite-only user onboarding with expiring tokens + email delivery
- **Real-time Auth**: JWT-based authentication with localStorage persistence
- **Responsive UI**: Modern TailwindCSS design with dark mode support

**Production-ready** with TypeScript, Zod validation, async handlers, and comprehensive error handling.

## 🛠️ Tech Stack

### Backend
```
Node.js 20+ | Express 4 | TypeScript 5 | MongoDB | Mongoose
JWT | Nodemailer | Zod Validation | asyncHandler | dotenv
```

## 🚀 Quick Start (Local Development)

### Backend Setup
```bash
# 1. Clone & Install
cd backend
pnpm install

# 2. Environment (.env)
cp .env.example .env
# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/nexus
# JWT_SECRET=your-super-secret-key-32chars-min
# GMAIL=your@gmail.com
# APP_PASS=your-16char-app-password
# CLIENT_URL=http://localhost:3000

# 3. Start MongoDB
# MongoDB Compass or mongod service

# 4. Run Dev Server
pnpm dev
# http://localhost:5001/api/v1
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── helper/
│   ├── middlewares/       # auth, validation, error
│   ├── modules/
│   │   ├── auth/          # Authentication & registration, user managment
│   │   ├── project/       # CRUD operations
│   │   ├── invite/        # Invitation system
│   ├── handlers/          # asyncHandler, responseHandler
│   ├── types/
│   └── utils/             # HTTP codes, validators
├── root.route.ts/
├── server.ts/
```

## 🔐 Authentication Flow
```
1. Admin creates invite → Email with token link
2. User visits /invite?token=abc → Set password
3. acceptInvite(token, password) → Creates user account
4. Auto-login → Dashboard
```

## 🧪 Test Accounts
```
Email: admin@nexus.com | Password: admin123
Email: jane@nexus.com  | Password: password123
```

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login` | User login | - |
| `POST` | `/invite/create-invite` | Create user invite | Admin |
| `POST` | `/invite/accept-invite` | Create user invite |
| `POST` | `/projects/` | create project | Auth |
| `GET` | `/projects/` | Get all project | Auth |
| `PATCH` | `/projects/:id` | Update Project name & description etc | Auth |
| `PATCH` | `/projects/soft_delete/:id` | Soft delete project | Auth |
| `PUT` | `/auth/update/:id` | Update user role/status | Admin |
| `GET` | `/auth/get-all-users` | Paginated users | Auth |

## ⚙️ Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-super-secret-jwt-key-min32chars
GMAIL=your@gmail.com
APP_PASS=your-app-password-from-google
CLIENT_URL=http://localhost:3000
```


## 🎮 Features
- ✅ **Role-Based Access**: Admin/Manager/Staff permissions
- ✅ **Soft Delete**: Projects marked `isDeleted: true`
- ✅ **Pagination**: Users/Projects (5/page default)
- ✅ **Invite System**: Expiring tokens + email
- ✅ **Responsive**: Mobile-first TailwindCSS
- ✅ **Dark Mode**: Automatic system preference
- ✅ **TypeScript**: Full type safety
- ✅ **Error Boundaries**: Graceful failures

## 🚀 Production Deployment

```bash
# Backend (Railway/Vercel/Render)
pnpm build
pnpm start
```

## 📄 License
MIT License - Free for personal/commercial use.
