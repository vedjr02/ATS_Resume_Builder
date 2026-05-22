# ATS Resume Tailor

A full-stack web application that takes a **Job Description** and **Current Resume**, uses Google Gemini to rewrite and optimize the resume for ATS systems, converts it to LaTeX, compiles a PDF via Overleaf, and returns a downloadable tailored resume.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Google Gemini (`gemini-2.5-flash`, free tier via Google AI Studio)
- **PDF:** Overleaf (authenticated HTTP pipeline)

## Prerequisites

- Node.js 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey)
- An active [Overleaf](https://www.overleaf.com/) account with valid session cookies

## Setup

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |----------|-------------|
   | `GEMINI_API_KEY` | Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) |
   | `GEMINI_MODEL` | (Optional) Model name, default `gemini-2.5-flash` |
   | `OVERLEAF_SESSION_COOKIE` | Raw value of the `overleaf_session2` cookie |
   | `OVERLEAF_GCLB_TOKEN` | Raw value of the `GCLB` cookie |
   | `PORT` | (Optional) Server port, default `3001` |

3. **Refresh Overleaf cookies**

   Overleaf session cookies expire periodically. To refresh:

   1. Log in to [overleaf.com](https://www.overleaf.com/) in your browser.
   2. Open **DevTools** → **Application** → **Cookies** → `https://www.overleaf.com`.
   3. Copy the **Value** of:
      - `overleaf_session2` → paste into `OVERLEAF_SESSION_COOKIE`
      - `GCLB` → paste into `OVERLEAF_GCLB_TOKEN`
   4. Restart the server.

4. **Run in development**

   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3001](http://localhost:3001)

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

   The Express server serves the built React app and the API on the same port.

## API

### `POST /api/generate`

**Request body:**

```json
{
  "jobDescription": "string",
  "currentResume": "string"
}
```

**Response:** Server-Sent Events stream with status updates, ending in:

```json
{
  "status": "success",
  "pdfUrl": "https://www.overleaf.com/...",
  "projectUrl": "https://www.overleaf.com/project/...",
  "pdfBase64": "..."
}
```

**Rate limit:** 10 requests per IP per hour.

## Pipeline

1. Gemini rewrites the resume for ATS optimization
2. Gemini converts the markdown resume to LaTeX
3. Overleaf CSRF token is fetched
4. A new Overleaf project is created with the LaTeX
5. The project is compiled to PDF
6. The PDF is downloaded and returned as base64

## Privacy

- Resume text and job descriptions are **never logged** or persisted
- All processing happens **in-memory** per request
- No database is used

## License

MIT
