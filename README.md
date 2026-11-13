# 🏠 Bachelor Point – Smart Flat Management System

**Bachelor Point** is a full-stack web application designed to simplify and digitize the daily management of bachelor flats. It provides a centralized platform where flat members can manage household responsibilities, track shared expenses, handle bills, maintain shopping lists, and stay updated through real-time activity notifications.

Instead of relying on traditional paper-based records and manual coordination, Bachelor Point brings everything together in one organized and user-friendly platform.

## 🚀 Live Demo

- **Live Website:** https://bachelor-point2026.vercel.app
- **GitHub Repository:** https://github.com/HamimRaju/Bachelor-Point

## ✨ Key Features

### 👤 Authentication & Personalized Dashboard
- Secure user authentication using Better Auth.
- Individual accounts for each flat member.
- Personalized dashboards based on the logged-in user.
- Protected routes and user-specific access.

### 🔄 Automated Task Rotation
- Automatically manages rotating household responsibilities among five flat members.
- Tracks current assignments and previous task history.
- Members can mark their assigned tasks as **Done** or **Skip**.
- Only the assigned member can perform actions on their own task.
- Skipped responsibilities remain pending while the next member receives the immediate turn.

### 🔔 Notification System
- Notifies members about completed tasks and important household activities.
- Maintains notification history.
- Supports marking notifications as read.

### 🛒 Shopping List Management
- Organizes daily household shopping requirements.
- Helps members keep track of shared purchasing needs.

### 💰 Bill Management
- Manages regular household bills, including:
  - House Rent
  - Wi-Fi Bill
  - Garbage Bill
  - Electricity Bill
- Tracks payment status and bill records.

### 🧾 Shared Expense Management
- Records additional household expenses.
- Supports shared expense distribution among flat members.
- Helps maintain transparency in household spending.

### 👥 Member Management
- Displays flat members' profiles and information.
- Includes member photos and quick contact options.
- Provides an organized overview of all flatmates.

### 📅 Activity & Calendar
- Keeps track of household activities.
- Helps members stay informed about responsibilities and upcoming tasks.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React.js | User interface development |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| HeroUI | UI components |
| Better Auth | Authentication and session management |
| MongoDB | Database |
| Mongoose | Database modeling and data management |
| Lucide React | Icons |
| Vercel | Deployment |
| Git & GitHub | Version control and collaboration |

## 🧠 Core Application Logic

One of the main challenges of Bachelor Point is implementing a fair and reliable task rotation system.

The application manages household responsibilities across five members:

- Raju
- Rubel
- Arefin
- Real
- Radin

**Task Assignment Rules:**

1. Each rotating task has its own assignment sequence.
2. The system identifies the member whose turn it is.
3. Only the currently assigned member can complete or skip that task.
4. When a task is completed, the system updates its rotation history and notifies the members.
5. When a member skips a task, the next member receives the immediate turn, while the original skipped responsibility remains pending.

This approach ensures accountability and prevents unauthorized task updates.

## 📱 User Experience

- Mobile-first and responsive interface.
- App-like navigation for easier access on smartphones.
- Personalized dashboard for each member.
- Organized sections for tasks, bills, expenses, notifications, and shopping.
- User-friendly interactions and clear task statuses.

## ⚙️ Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS)
- npm
- Git
- MongoDB database (local or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/HamimRaju/Bachelor-Point.git
```

### 2. Navigate to the Project Directory

```bash
cd Bachelor-Point
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and configure the required environment variables.

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

Add any additional environment variables required by your current application configuration.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## 📂 Project Structure

The project follows a structured Next.js application architecture.

```text
Bachelor-Point/
│
├── public/
│   └── Member profile images
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   │
│   │   ├── (dashboard)/
│   │   │   └── Dashboard pages
│   │   │
│   │   ├── actions/
│   │   │   ├── auth.actions.ts
│   │   │   ├── task.actions.ts
│   │   │   ├── bill.actions.ts
│   │   │   └── expense.actions.ts
│   │   │
│   │   └── ...
│   │
│   ├── lib/
│   │   └── db.ts
│   │
│   └── models/
│       └── Bill.ts
│
├── .env.local
├── package.json
└── README.md
```

*Note: The structure above is a simplified overview. Actual folders and files may vary depending on the latest implementation.*

## 🔐 Security & Access Control

- Authenticated access to protected application areas.
- Individual user sessions.
- Server-side authorization for task actions.
- Restricted task completion and skipping to the assigned member.
- Environment variables used for sensitive configuration.

## 🎯 Project Goals

Bachelor Point was developed to solve common management problems in shared bachelor accommodations by introducing:

- Better coordination among flat members.
- Transparent expense and bill management.
- Fair distribution of household responsibilities.
- Reduced manual effort.
- A centralized digital management system.

## 👨‍💻 Developer

**Sheikh Hamim Islam Raju**

- GitHub: [@HamimRaju](https://github.com/HamimRaju)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Built with ❤️ to make shared living simpler and smarter.**