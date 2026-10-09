# WeTube — Frontend

A YouTube-inspired video-sharing platform built with **React**. WeTube lets users explore videos, watch content, interact with creators, manage their accounts, and personalize their experience.

## ✨ Features

- **Authentication** — User registration, login, and logout.
- **Video Feed** — Browse videos and discover content.
- **Video Player** — Watch videos on dedicated watch pages.
- **Channel Pages** — View creator profiles and their uploaded videos.
- **Likes** — Like videos and view your liked videos.
- **Comments** — Interact with videos through comments.
- **Tweets** — Explore and interact with creator tweets.
- **Subscriptions** — Subscribe to channels.
- **User Settings** — Update account details, change passwords, and upload avatar and cover images.
- **Watch History** — Access previously watched videos.
- **Responsive UI** — A component-based interface designed for a smooth browsing experience.

## 🛠️ Tech Stack

- **React** — User interface
- **React Router** — Client-side routing
- **Axios** — HTTP requests to the backend API
- **JavaScript** — Application logic
- **CSS** — Styling and layout

## 📁 Project Structure

```text
wetube-frontend/
├── public/
├── src/
│   ├── api/            # API requests and Axios configuration
│   ├── components/     # Reusable UI components
│   ├── context/        # Authentication and shared state
│   ├── pages/          # Application pages
│   ├── utils/          # Formatting and helper functions
│   ├── App.jsx         # Application routes and layout
│   └── main.jsx        # Application entry point
├── .env.example
├── package.json
└── README.md
```

*The structure above is representative; adjust it to match your actual project files.*

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- The WeTube backend running locally

### 1. Clone the repository

```bash
git clone <your-frontend-repository-url>
cd wetube-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Make sure your Axios configuration uses this environment variable. For example:

```js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

If your backend uses a different URL or your Axios client is already configured, use your existing configuration instead.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

```text
http://localhost:5173
```

## 🔗 Backend

WeTube's frontend communicates with a backend API for authentication, video management, likes, comments, subscriptions, and user account operations.

Configure the API base URL to point to your running backend. Authentication and cookie-based requests may also require the backend's CORS and cookie settings to be configured correctly.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |

Never put private API keys, database credentials, JWT secrets, or other server-side secrets in frontend environment variables. Variables prefixed with `VITE_` are exposed to the client.

## 🧑‍💻 Development

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🗺️ Roadmap

- Improve responsive design and accessibility.
- Add search and discovery enhancements.
- Improve loading, empty, and error states.
- Refine the user profile and channel experience.
- Deploy the frontend and connect it to a production backend.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome. Feel free to fork the repository, make improvements, and submit a pull request.

## 📄 License

Choose and add a license before distributing this project publicly.

---

**WeTube** — Watch, discover, and connect.
