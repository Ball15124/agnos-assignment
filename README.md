# CareTerminal

CareTerminal is a real-time patient information monitoring system that enables staff to securely observe and manage patient form sessions as information is entered. Built with a responsive interface and real-time communication, it keeps staff updated on patient activity, form changes, and submission status.

## Features

- **Patient Form** — A responsive form for patients to enter their personal details (name, date of birth, gender, contact info, address, preferred language, nationality, emergency contact, religion).
- **Staff View** — A real-time dashboard where staff can monitor patient input as it happens, field by field.
- **Live Status Indicators** — Staff can see whether a patient is actively filling in the form, idle, or has submitted.
- **Real-Time Synchronization** — Powered by WebSockets, so any change on the patient form reflects instantly on the staff view.
- **Responsive Design** — Both the patient form and staff view adapt to mobile and desktop screen sizes.

## Tech Stack

- **Framework:** Next.js
- **Styling:** TailwindCSS
- **Real-Time Communication:** WebSockets (`ws`)
- **Hosting:** Frontend deployed on [Vercel/Netlify — update with actual platform], WebSocket server deployed on Render

## Getting Started

### Prerequisites

- Node.js and npm installed

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```
2. Move into the project root
   ```bash
   cd agnos-assignment
   ```
3. Install dependencies
   ```bash
   npm i
   ```

### Running Locally

The app requires two processes running at the same time — the WebSocket server and the Next.js dev server. Open two terminal windows:

**Terminal 1 — start the WebSocket server** (listens on port `8080`)
```bash
npm run ws
```

**Terminal 2 — start the Next.js app**
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL used by the client | `ws://localhost:8080` |
| `PORT` | Port the WebSocket server listens on | `8080` |

## Live Demo

- **Deployed App:** [https://care-terminal.vercel.app/]

## Notes

- The WebSocket server is hosted on Render's free tier, which spins down 
  after periods of inactivity. The first request after idle may take 
  20-30 seconds to respond while the instance wakes up. Subsequent 
  requests will be fast

## Project Structure

See `docs/PROJECT_STRUCTURE.md` for a full breakdown of the folder/file structure.

## Development Planning Documentation

- `docs/PROJECT_STRUCTURE.md` — Explanation of the folder/file structure
- `docs/DESIGN.md` — Design decisions for UI/UX across screen sizes
- `docs/COMPONENT_ARCHITECTURE.md` — Description of main components and their purposes
- `docs/REALTIME_SYNC_FLOW.md` — Summary of how real-time updates are handled and synchronized

## License

This project was built as part of a candidate assignment for Agnos.
