# 🚀 AI LifeDesk

> **"One AI. Every Customer-Service Problem."**  
> An autonomous, end-to-end customer support intelligence platform engineered with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and Google Gemini AI.

---

## 🌟 Overview

**AI LifeDesk** reimagines omnichannel customer support by combining autonomous 24/7 AI conversational triage, multi-agent copilot drafting, proactive fraud risk screening, grounded knowledge base search, and real-time operational analytics into a unified web application.

Whether handling Tier-1 inquiries, complex account inquiries, or high-risk refund disputes, AI LifeDesk streamlines resolution time from hours to seconds while maintaining human oversight with supervisor controls.

---

## ⚡ Key Highlights & Capabilities

### 1. 🤖 24/7 Autonomous AI Customer Assistant (`/chat`)
- Grounded conversational customer service powered by **Google Gemini** with automatic fallback to domain-specific knowledge heuristics.
- Real-time RAG (Retrieval-Augmented Generation) against the indexed Knowledge Base.
- Instant sentiment detection, urgency prioritization, and one-click ticket escalation.
- Multi-language support and structured intent classification.

### 2. 🛡️ Real-Time Fraud & Anomaly Screening (`/fraud`)
- Integrated risk evaluation engine inspecting velocity spikes, high-value refund requests, and geofence/credential irregularities.
- Telemetry signal attribution scoring from 0 to 100 with risk tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- Supervisor review workflow allowing operators to audit, escalate, or dismiss flagged transactions.

### 3. 🎧 AI Agent Copilot & Workspace (`/agent`, `/tickets/[id]`)
- One-click **AI Response Drafting** grounded in ticket history and policies.
- AI Executive Summarization for fast context handoffs between support tiers.
- Ticket root-cause explanation and priority confidence scoring.
- Visual ticket lifecycle transparency timeline tracking every step from creation to customer closure.

### 4. 📊 Unified Operations & Analytics (`/admin`, `/dashboard`)
- Interactive operational dashboards with real-time ticket volume by status, priority, and department.
- Weekly resolution trend charts and automated AI operational intelligence insights.
- Role-based views customized for **Customers**, **Support Agents**, and **Admins**.

### 5. 📚 Indexed Knowledge Base (`/knowledge`)
- Searchable self-service portal organized by category (Orders, Billing, Security, Technical).
- Helpful/unhelpful article telemetry to guide support documentation improvements.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Next.js API Routes (Edge & Serverless compatible), Zod validation |
| **Database & ORM** | Prisma ORM with SQLite (zero-config, high-speed local persistence) |
| **Authentication** | JWT session cookies (`jose`), BCrypt password hashing, Role-Based Access Control (`CUSTOMER`, `AGENT`, `ADMIN`) |
| **AI Engine** | Google Gemini Generative AI SDK (`@google/generative-ai`) with heuristic resilience layer |
| **Security** | Auditing logs, fraud screening heuristics, input sanitization, rate-limiting scaffolds |

---

## 🔑 Demo Accounts & Pre-Seeded Credentials

All seeded accounts share the default password: **`password123`**

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@lifedesk.ai` | `password123` | Full system control, analytics, fraud audits, ticket assignment |
| **Support Agent** | `sarah.jenkins@lifedesk.ai` | `password123` | Agent Copilot, ticket triage, customer directory |
| **Support Agent** | `alex.chen@lifedesk.ai` | `password123` | Agent Copilot, ticket queue, analytics |
| **Customer** | `jane.doe@example.com` | `password123` | 24/7 AI chat, ticket submission, status tracking |
| **Customer** | `robert.smith@example.com` | `password123` | Self-service portal, ticket management |

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js** (v18.17.0+ or v20+)
- **npm** (v9+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ngadhari31-netizen/Lifedesk-AI.git
cd Lifedesk-AI
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Add your `GEMINI_API_KEY` for live Google Gemini LLM API calls. A fallback heuristic engine is included by default so the application runs out of the box even without an external API key!)*

### 3. Initialize & Seed Database
```bash
npm run db:push
npm run db:seed
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience AI LifeDesk.

---

## 🧪 Testing & Validation

The repository includes an automated verification test suite checking database persistence, user authentication, knowledge base grounding, ticket pipelines, fraud alerts, and audit logging:

```bash
npm test
```

Expected output:
```
====================================================
       AI LIFEDESK - SYSTEM VERIFICATION SUITE       
====================================================

[1/5] Testing Database Persistence & Users...
  ✓ [PASS] Database contains users
  ✓ [PASS] Admin user account exists
  ✓ [PASS] Agent user account exists
  ✓ [PASS] Customer user account exists

[2/5] Testing Knowledge Base & Grounding Context...
  ✓ [PASS] Knowledge base has published articles
  ✓ [PASS] Refund policy article is indexed

[3/5] Testing Ticket Management & Data Integrity...
  ✓ [PASS] Database contains active support tickets
  ✓ [PASS] Ticket has relational category and message history

[4/5] Testing Fraud Screening & Telemetry Signals...
  ✓ [PASS] Fraud risk events are recorded
  ✓ [PASS] High-risk anomaly events have associated telemetry signals

[5/5] Testing Security Audit Logs...
  ✓ [PASS] Audit logging system is active

====================================================
Results: 11 Passed, 0 Failed
====================================================
```

---

## 📁 Project Directory Structure

```
├── app/
│   ├── (auth)/login/        # Secure login & signup with demo credentials
│   ├── admin/               # Administrative control center & platform analytics
│   ├── agent/               # Agent triage workspace & ticket queue
│   ├── api/                 # RESTful Next.js API route handlers
│   │   ├── ai/              # AI chat, copilot drafting, summarization, triage
│   │   ├── analytics/       # Operational stats & metrics
│   │   ├── auth/            # JWT authentication & session management
│   │   ├── feedback/        # CSAT ratings & resolution feedback
│   │   ├── fraud/           # Fraud detection & risk review workflows
│   │   ├── knowledge/       # Knowledge base search & CRUD
│   │   ├── notifications/   # In-app real-time alerts
│   │   ├── tickets/         # Ticket lifecycle management & conversation
│   │   └── users/           # User management & directory
│   ├── chat/                # Autonomous 24/7 AI conversational support portal
│   ├── dashboard/           # User & agent role-tailored dashboard
│   ├── fraud/               # Risk screening & fraud review interface
│   ├── knowledge/           # Self-service Knowledge Base
│   ├── tickets/             # Ticket listing & filtering
│   │   └── [id]/            # Ticket thread, timeline, agent copilot & CSAT dialog
│   ├── layout.tsx           # Global Root Layout with AuthProvider
│   └── page.tsx             # Interactive landing page
├── components/
│   ├── chat/                # ChatWindow with quick prompts & streaming UI
│   ├── dashboard/           # StatsCard, AnalyticsCharts, AIInsightCard, AgentCopilot
│   ├── feedback/            # CSAT FeedbackDialog
│   ├── fraud/               # FraudAlert banner & RiskReviewDialog
│   ├── layout/              # Navbar, Sidebar, NotificationDropdown
│   ├── tickets/             # TicketTable, TicketTimeline
│   └── ui/                  # Reusable accessible UI components (Button, Modal, Badge, etc.)
├── context/
│   └── AuthContext.tsx      # Global React AuthContext & session hooks
├── lib/
│   ├── ai/                  # Gemini AI service & fallback heuristics
│   ├── auth/                # JWT cookie verification & password hashing
│   ├── db/                  # Prisma client instance
│   ├── security/            # Audit logging & security utilities
│   └── validation/          # Zod schema definitions
├── prisma/
│   ├── schema.prisma        # Complete database schema
│   └── seed.js              # Comprehensive demo seed data
└── scripts/
    └── run-tests.js         # Automated verification suite
```

---

## 📄 License

MIT License. Designed and built with ❤️ for next-generation customer support engineering.
