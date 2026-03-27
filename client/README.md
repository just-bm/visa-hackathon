# DQS-AI Frontend 🚀

The official React-based dashboard for **DQS-AI** (Data Quality Service AI). This frontend provides an intuitive interface for payment professionals and auditors to analyze datasets, connect to live databases, and interact with the GenAI-powered Auditor Agent.

## ✨ Features

- **Multi-Source Analysis**: Upload CSVs, connect to PostgreSQL/MongoDB, or analyze REST API endpoints.
- **Explainable AI Insights**: View detailed Data Quality Scores (0-100) with natural language explanations for every anomaly.
- **Interactive Chat Auditor**: Real-time streaming chat with a specialized AI agent (DQS-AI) to discuss remediation steps and regulatory risks.
- **Remediation Reports**: Generate and export downloadable Markdown reports with prioritized fix actions.
- **Premium UI/UX**: Built with a sleek dark-mode aesthetic, smooth Framer Motion animations, and responsive layouts.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (controlled via `vite.config.js`).

## ⚙️ Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_URL=http://localhost:8000
```

- `VITE_API_URL`: Points to the Node.js backend (metadata extraction).
- `VITE_AI_URL`: Points to the FastAPI service (GenAI analysis).

---
Built for the **Shaastra 2026 AI Hackathon** (Visa Track).