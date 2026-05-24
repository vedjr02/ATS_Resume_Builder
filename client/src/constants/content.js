export const STATUS_STEPS = [
  'Analyzing job description…',
  'Rewriting resume with Gemini…',
  'Building LaTeX from template…',
  'Compiling PDF on Overleaf…',
  'Done!',
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste your inputs',
    description: 'Drop in the job description and your current resume as plain text.',
    icon: 'clipboard',
  },
  {
    step: '02',
    title: 'AI tailors content',
    description: 'Gemini rewrites bullets, skills, and summary for ATS keyword alignment.',
    icon: 'sparkles',
  },
  {
    step: '03',
    title: 'Download your PDF',
    description: 'Get a polished, recruiter-ready PDF compiled from your fixed LaTeX template.',
    icon: 'download',
  },
];

export const FEATURES = [
  { label: 'ATS keyword mapping', detail: 'JD terms woven naturally into bullets' },
  { label: 'Fixed LaTeX layout', detail: 'Consistent professional formatting every time' },
  { label: 'Privacy-first', detail: 'Processed in-memory, never stored' },
  { label: 'Under 60 seconds', detail: 'From paste to downloadable PDF' },
];

export const HERO_STATS = [
  { value: '<60s', label: 'Average generation' },
  { value: '100%', label: 'In-memory processing' },
  { value: 'PDF', label: 'Recruiter-ready output' },
];
