const fs = require('fs');

const content = `# 🛠️ SkillRelay

> **A modern, full-stack platform for booking verified local appliance repair technicians.**

![SkillRelay](https://img.shields.io/badge/Status-Active-success.svg) ![License](https://img.shields.io/badge/License-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)

SkillRelay bridges the gap between customers needing urgent appliance repairs and highly-rated, background-checked local technicians. 

## ✨ Key Features

- **Dual Dashboards:** Custom-tailored portals for both **Customers** and **Technicians**.
- **Instant Booking Flow:** Customers can search by skill, city, or appliance, view technician profiles, and instantly book a service.
- **Service Management:** Technicians can accept, decline, or mark active jobs as completed directly from their dashboard.
- **Automated Email Notifications:** Customers and technicians receive instant branded HTML email confirmations (powered by Nodemailer).
- **Secure Authentication:** Integrated Google OAuth & OTP email verification for secure login/registration.
- **Dynamic Avatars:** Technicians can upload their own profile pictures (Cloudinary), or fall back to sleek UI avatars.

## 🏗️ Tech Stack

**Frontend (Client)**
- React (Vite)
- TypeScript
- Tailwind CSS & shadcn/ui
- React Router DOM
- Lucide Icons

**Backend (Server)**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Nodemailer (Email services)
- Cloudinary (Image hosting)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB URI (Atlas or local)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/abhineet1509/skill-relay.git
cd skill-relay
\`\`\`

### 2. Environment Variables
Create a \`.env\` file in the \`server\` directory and add the following:

\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Email configuration (for Nodemailer)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (Avatar Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### 3. Installation & Running Locally

**Start the Backend:**
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`
*(Server runs on http://localhost:5000)*

**Start the Frontend:**
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*(Client runs on http://localhost:5173)*

## 📂 Project Structure

\`\`\`text
skill-relay/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (AuthContext, ProtectedRoute)
│   │   ├── layouts/        # Page layouts (Navbar)
│   │   └── pages/          # Main views (Home, Dashboards, Profiles, Login)
│   └── vite.config.ts      
└── server/                 # Node/Express Backend
    ├── src/
    │   ├── config/         # DB & Cloudinary configurations
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Auth & Validation middleware
    │   ├── models/         # Mongoose Schemas (User, Booking)
    │   ├── routes/         # API Endpoints
    │   └── services/       # Email services
    └── package.json
\`\`\`

---
*Designed with simplicity, speed, and professionalism in mind.*
`;

fs.writeFileSync('e:/SKILL RELAY/README.md', content, 'utf8');
