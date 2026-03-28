<div align="center">
  <h1>🌿 AYUSH Startup Registration & Investor Portal</h1>
  <p><i>Empowering the ecosystem of traditional medicine with Agentic AI, Seamless Workflows, and Vercel-Edge Scalability.</i></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
  [![Neon Postgres](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?logo=postgresql)](https://neon.tech/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)](https://ai.google.dev/)
  [![NextAuth](https://img.shields.io/badge/NextAuth.js-Security-blue?logo=next.js)](https://next-auth.js.org/)

  **[🔴 View Live Demo](https://ayush-portal-live.vercel.app/)**
</div>

---

## 🎯 The Vision
This platform was engineered from **first principles** to solve the fragmentation in the Ministry of AYUSH ecosystem. It serves as a unified digital bridge connecting **Founders**, **Government Administrators**, and **Venture Capital Investors**. 

Going far beyond standard data-entry, this portal introduces a fully integrated **Agentic AI OSINT Analyzer**, transforming raw portal entries into actionable, high-impact competitive intelligence for modern investors.

---

## ✨ Key Features & Architecture

### 🛡️ 1. Advanced Role-Based Access Control (RBAC)
Powered by **NextAuth.js** and secure HTTP-Only sessions, the portal dynamically protects routes and renders specific dashboards based on their Prisma-backed profiles.
- **Founders:** Multi-step registration wizard handling complex startup metadata and document lifecycle logic.
- **Admins:** Centralized command center to rapidly `Approve`, `Reject`, or `Request Changes` for live applications, saving state instantly.
- **Investors:** Dynamic startup discovery feed with persistent bookmarking features.

### 🧠 2. Agentic AI OSINT Analyzer (The Crown Jewel)
Integrated directly onto the Investor Dashboard. When an investor clicks **"Initialize OSINT Sweep"**, the platform:
- Spawns a sleek, hacker-style terminal UI displaying telemetry.
- Invokes the **Google Gemini 2.5 Flash** API via a secure serverless Next.js endpoint.
- Generates a highly structured, JSON-formatted web-intelligence report covering:
  - 📈 **Growth Kinetics:** Projected runway and expansion rates.
  - ⚖️ **Risk Matrix:** Regulatory & Compliance threat levels.
  - ⚔️ **Market Competitors:** Identified active rivals in the specific Ayurvedic/Yoga sector.
  - 📊 **Sentiment:** Web-aggregated public sentiment analysis.

### ⚡ 3. Vercel-Optimized Fullstack Architecture
- **Database:** Serverless **Neon PostgreSQL** managed seamlessly by **Prisma ORM**.
- **Frontend/Backend:** **Next.js 14 App Router** seamlessly blending Server-Side Rendering (SSR) for live dashboards, and Static Generation (SSG) for high-traffic landing pages.
- **Styling:** Tailored **Vanilla Tailwind CSS** with custom keyframe animations (`animate-pulse-fast`, `animate-fade-in`) ensuring a premium, glassmorphic aesthetic.

---

## ⚙️ Local Development Setup

We've completely overhauled the local setup to be incredibly developer-friendly. 

### 1. Clone & Install
```bash
git clone https://github.com/Tribal-Chief-001/Ayush-Portal-EPICS.git
cd ayush-portal
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the root directory and add the following keys:
```env
# Serverless Database (Neon Postgres)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-empty-star-a1i0lrtr.../neondb?sslmode=require&channel_binding=require"

# Authentication Security (NextAuth)
NEXTAUTH_SECRET="ayush-portal-v1-production-super-secret-key-9921"
NEXTAUTH_URL="http://localhost:3000"

# AI Agent Configuration
GEMINI_API_KEY="YOUR_GOOGLE_AI_STUDIO_KEY"
```

### 3. Initialize Database
Because we use Prisma, fetching the complex schema is just one command:
```bash
npx prisma generate
```

### 4. Launch the Mothership
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 🔑 Demo Credentials
To explore the different RBAC routing instantly without registering, use these pre-configured accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Startup Founder** | `vikram@vedalife.com` | `demo1234` |
| **VC Investor** | `investor@globalvc.com` | `demo1234` |
| **Government Admin** | `admin@ayush.gov.in` | `demo1234` |

*(Tip: You can use the "Auto-Fill" mode buttons directly on the Login page to speed up testing!)*

---

<div align="center">
  <i>Built with ☕ and rigorous first principles.</i>
</div>
