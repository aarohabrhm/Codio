<div align="center">

# Codio

**Code together. Ship faster. No context-switching required.**

A full-stack collaborative coding platform where teams can write, run, chat, and ship code — all in one place, in real time.

[![Made with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](#tech-stack)
[![Made with Express](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-47A248?logo=mongodb&logoColor=white)](#tech-stack)
[![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-black?logo=socket.io)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

</div>

---

## What is Codio?

Ever wished Google Docs and VS Code had a baby? That's Codio.

It's a collaborative coding platform built for teams who want to write code together, talk about it without switching apps, run it without leaving the browser, and get a little AI help when they're stuck — all in real time, all in one workspace.

No more "hey can you share your screen." No more fifteen Slack tabs. Just you, your team, and a shared editor that actually keeps up.

## Features

| | |
|---|---|
| **Auth** | Login, registration, OTP verification and password reset |
| **Real-time collaborative editor** | Powered by Socket.IO, so everyone's cursor and changes sync instantly |
| **Project dashboard & workspaces** | Organize your projects |
| **In-app chat** | Talk through the problem without leaving the editor |
| **AI-assisted coding** | A little help when you're staring at a bug at 2am |
| **Code execution backend** | Run your code right where you wrote it |
| **Checkpoints & version snapshots** | Because "final_v2_ACTUAL_final" is not a version control strategy |
| **Custom avatars & profiles** | Make it feel like *your* workspace |
| **Responsive UI** | Looks and works great on any screen |

## Tech Stack

**Frontend**
- React + Vite — fast dev, fast builds
- React Router — client-side routing
- Axios — API calls
- Tailwind CSS — styling 
- Monaco Editor — the same editor engine behind VS Code
- Socket.IO Client — real-time sync
- Framer Motion — smooth animation
- XTerm — in-browser terminal

**Backend**
- Node.js + Express.js — API server
- MongoDB + Mongoose — data layer
- Socket.IO — real-time server
- JWT — authentication
- Nodemailer — emails (OTP, password reset)
- bcrypt — password hashing done right

## Project Structure

```bash
/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
├── README.md
└── package.json     # Root scripts for running both apps
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or a MongoDB Atlas connection string)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/aarohabrhm/codio.git
cd codio
```

### 2. Install dependencies

```bash
# From the root — installs client, server, and root deps
npm install
```

> If your root `package.json` doesn't handle this automatically, install each workspace separately:
> ```bash
> cd client && npm install
> cd ../server && npm install
> ```

### 3. Set up environment variables

Create a `.env` file inside `server/` with something like:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

And if your client needs its own `.env` for the API base URL:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run it

```bash
# From the root — spins up client + server together
npm run dev
```

Or run them separately if you prefer two terminals:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Then open `http://localhost:5173` and start coding. 

## Contributing

Contributions, issues, and feature requests are welcome. If you'd like to help out:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/something-cool`)
3. Commit your changes (`git commit -m 'Add something cool'`)
4. Push to the branch (`git push origin feature/something-cool`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---
