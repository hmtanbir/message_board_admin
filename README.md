# 📋 Message Board Admin

A modern, high-performance admin dashboard built with **Next.js 16**, **Tailwind CSS v4**, and **Genkit AI**. This platform provides comprehensive management for projects, accounts, and users, featuring secure API communication and AI-driven insights.

---

## 🚀 Features

- **Dashboard Analytics**: Real-time insights using data visualization with Recharts.
- **Account Management**: Comprehensive control over platform accounts and subscription statuses.
- **Project Orchestration**: Manage and monitor message board projects with ease.
- **User Administration**: Robust user management with granular controls.
- **AI Integration**: Powered by **Genkit** and **Google Gemini** for intelligent features and automation.
- **Secure by Design**: Implementation of **AES-256-GCM** encryption for secure API payload exchange.
- **Modern UI/UX**: Built with **Radix UI** primitives and **Tailwind CSS v4** for a premium, responsive experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **AI Framework**: [Genkit AI](https://firebase.google.com/docs/genkit)
- **Visualization**: [Recharts](https://recharts.org/)
- **Deployment**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v20 or later
- **pnpm**: v9 or later (recommended)
- **Docker**: For containerized deployment

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd admin
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:9001](http://localhost:9001) in your browser.

---

## 🐳 Docker Deployment

The project is fully containerized for production stability and easy deployment.

### Using Docker Compose (Recommended)

To build and start the application in production mode:

1. **Build and start the containers**:
   ```bash
   docker-compose up --build -d
   ```

2. **Verify the application is running**:
   ```bash
   docker-compose ps
   ```
   The application will be accessible at [http://localhost:9001](http://localhost:9001).

### Manual Docker Build

If you prefer to build the image manually:

```bash
docker build -t message-board-admin .
docker run -p 9001:9001 --env-file .env.production message-board-admin
```

---

## ⚙️ Configuration

The following environment variables are required for the application to function correctly:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Local port for the application | `9001` |
| `GEMINI_API_KEY` | Google Gemini API Key for AI features | - |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API | - |
| `NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED` | Enable/Disable payload encryption | `true` |
| `NEXT_PUBLIC_API_GATEWAY_KEY` | Gateway authentication key | - |
| `NEXT_PUBLIC_API_ENCRYPTION_KEY` | AES-256-GCM encryption key | - |

---

## 📜 Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint for code quality.
- `pnpm typecheck`: Runs TypeScript compiler for type checking.
- `pnpm genkit:dev`: Starts Genkit AI development environment.

---

## 🏗️ Project Structure

```text
src/
├── ai/          # Genkit AI configurations and logic
├── app/         # Next.js App Router (pages and layouts)
├── components/  # Reusable UI components and feature-specific components
├── hooks/       # Custom React hooks
├── lib/         # Utility functions and core shared logic
```

---

## 🛡️ License

This project is private and confidential.
