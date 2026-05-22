# ATS Resume Tailor

A full-stack web application that takes a **Job Description** and **Current Resume**, uses Google Gemini to rewrite and optimize the resume for ATS systems, fills a fixed professional LaTeX template, compiles a PDF via Overleaf, and returns a downloadable tailored resume.

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

## Deploy to Vercel

This project is configured for [Vercel](https://vercel.com) out of the box.

### Before you deploy

1. **Push the repo to GitHub** — already at `vedjr02/ATS_Resume_Builder`.
2. **Import the project in Vercel** — [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
3. **Add environment variables** in Vercel → Project → Settings → Environment Variables:

   | Variable | Required |
   |----------|----------|
   | `GEMINI_API_KEY` | Yes |
   | `OVERLEAF_SESSION_COOKIE` | Yes |
   | `OVERLEAF_GCLB_TOKEN` | Yes |
   | `GEMINI_MODEL` | No |

4. **Use Vercel Pro (recommended)** — resume generation calls Gemini + Overleaf and can take 30–90 seconds. The Hobby plan has a **10s function timeout** which will fail. This project sets `maxDuration: 300` in `vercel.json` (requires Pro).
5. **Refresh Overleaf cookies** periodically — expired cookies break PDF compilation in production too.

### Deploy

```bash
npm i -g vercel
vercel
```

Or connect GitHub in the Vercel dashboard for automatic deploys on every push.

### How it works on Vercel

- **Frontend:** static build from `client/dist`
- **API:** Express app served via `api/index.js` serverless function
- **Routes:** `/api/*` → serverless function, everything else → React SPA

No separate backend URL needed — the frontend calls `/api/generate` on the same domain.

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

1. Gemini rewrites the resume as structured JSON tailored to the job description
2. The fixed LaTeX resume template is filled programmatically (consistent layout every time)
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
