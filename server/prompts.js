const RESUME_REWRITER_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Your task is to tailor the candidate's resume to a specific job description while preserving all factual information from the original resume.

## Inputs

**Job Description:**
{{JOB_DESCRIPTION}}

**Current Resume:**
{{CURRENT_RESUME}}

## Core Objective

Rewrite the resume content to maximize ATS keyword matching for the job description. Improve clarity, impact, and relevance while keeping the same sections and structure as the candidate's original resume format.

## Rules

1. Extract ONLY factual information from the current resume — do not invent employers, degrees, dates, or metrics.
2. Do NOT copy original phrasing verbatim — rewrite bullets and summary with fresh, achievement-oriented language.
3. Weave job-description keywords naturally into the profile summary, skills, and project bullets.
4. Prioritize projects and skills most relevant to the job description; keep all major projects but rewrite bullets to emphasize JD alignment.
5. Keep the candidate's contact details, education facts, and links exactly as provided (URLs may be kept as-is).
6. Profile summary: 3–5 sentences, role-aligned, ATS-optimized.
7. Each project: up to 3 bullets, strongest JD-relevant achievements first.
8. Leadership section: keep factual roles; rewrite description/bullets for impact.

## Output Format

Return ONLY valid JSON (no markdown fences, no commentary) matching this exact schema:

{
  "header": {
    "name": "Full Name",
    "location": "City, State/Country",
    "phone": "+91 ...",
    "email": "email@example.com",
    "linkedin": "https://linkedin.com/in/...",
    "github": "https://github.com/...",
    "portfolio": "https://...",
    "availability": "Available: ..."
  },
  "profileSummary": "Single paragraph profile summary text.",
  "education": [
    {
      "degree": "Degree Name",
      "dates": "Start -- End",
      "institution": "University Name, Location"
    }
  ],
  "skills": {
    "technical": "Comma-separated technical skills",
    "toolsAndPlatforms": "Comma-separated tools and platforms",
    "coreCompetencies": "Comma-separated competencies"
  },
  "projects": [
    {
      "title": "Project Title -- Context",
      "dates": "Mon YYYY -- Mon YYYY",
      "subtitle": "Optional subtitle or organization",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "leadership": [
    {
      "title": "Role Title",
      "dates": "Mon YYYY -- Mon YYYY",
      "organization": "Organization Name",
      "description": "Single paragraph if no bullets",
      "bullets": []
    }
  ]
}

Use "bullets" for leadership when multiple points exist; otherwise use "description" with empty bullets array.
Include ALL projects and education entries from the original resume.
Do not omit sections. If a section has no content, use an empty array or empty string as appropriate.`;

export function buildResumeRewriterPrompt(jobDescription, currentResume) {
  return RESUME_REWRITER_PROMPT.replace('{{JOB_DESCRIPTION}}', jobDescription).replace(
    '{{CURRENT_RESUME}}',
    currentResume
  );
}

export function parseResumeJson(rawText) {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/m, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('Gemini returned invalid resume JSON.');
    }
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

export function cleanLatexCode(latexCode) {
  return latexCode.replace(/^```latex\s*/i, '').replace(/\s*```$/m, '').trim();
}
