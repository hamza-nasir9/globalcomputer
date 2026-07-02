# GCI Global Computer Institute — Web Application

## Quick Start

### 1. Install Dependencies
```bash
cd gci-fresh
npm install
```

### 2. Configure Environment
Edit `.env.local` and fill in your real values:

```env
# MongoDB — replace YOUR_REAL_PASSWORD with your Atlas password
MONGODB_URI=mongodb+srv://admin:YOUR_REAL_PASSWORD@cluster0.nyhsnmf.mongodb.net/global?retryWrites=true&w=majority&appName=Cluster0

# Auth mode — must be 'api' for MongoDB to work
NEXT_PUBLIC_AUTH_MODE=api

# Email (Gmail App Password — NOT your regular Gmail password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
NOTIFICATION_EMAIL=gcisbte11@gmail.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create Admin Account in MongoDB
After starting the dev server, visit this URL **once** in your browser:

```
http://localhost:3000/api/admin/seed-admin
```

This creates the admin user in MongoDB:
- Email: admin@gmail.com
- Password: Admin@GCI2024

Change the password after first login.

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## CEO Photo Setup

Place the CEO photo at:  /public/images/ceo.jpg
Format: JPG or PNG | Recommended: 400x400 px square crop
Until the file is placed, the About page shows "FA" initials as fallback.

---

## Student Photo Upload

Photos upload to /public/uploads/ on the server filesystem.
The path (e.g. /uploads/1234567890-abc123.jpg) is stored in MongoDB.

NOTE: In production (Vercel), the filesystem is not persistent.
For production, switch the upload route to Cloudinary or AWS S3.
Upload API: src/app/api/upload/route.js

---

## Gmail App Password Setup

1. myaccount.google.com -> Security -> Enable 2-Step Verification (required)
2. Search "App passwords" -> Other -> Name it "GCI" -> Generate
3. Copy the 16-character code -> paste into .env.local as EMAIL_PASS

---

## Key API Routes

  /api/admin/seed-admin     GET   One-time admin account creation
  /api/admission            POST  Submit form | GET  Admin list all
  /api/admission/my         GET   Student's own submissions
  /api/admission/[id]       GET/PATCH/DELETE  By MongoDB ID
  /api/upload               POST  Photo upload -> /public/uploads/
  /api/auth/login           POST  API login
  /api/auth/register        POST  API register

---

## Database

  Provider:        MongoDB Atlas
  Database name:   global
  Collections:     users, admissions
