function escapeLatex(value) {
  if (value == null) return '';
  return String(value)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function hrefLink(url, label) {
  const safeUrl = String(url).replace(/\\/g, '/').replace(/#/g, '\\#').replace(/%/g, '\\%');
  const safeLabel = escapeLatex(label || url);
  return `\\href{${safeUrl}}{${safeLabel}}`;
}

function buildHeader(header) {
  const links = [];
  if (header.linkedin) links.push(hrefLink(header.linkedin, 'LinkedIn'));
  if (header.github) links.push(hrefLink(header.github, 'GitHub'));
  if (header.portfolio) links.push(hrefLink(header.portfolio, 'Portfolio'));
  if (header.availability) links.push(escapeLatex(header.availability));

  const linkLine = links.join('  $|$  ');

  return `% HEADER
\\begin{center}
    {\\Huge \\textbf{${escapeLatex(header.name)}}} \\\\[0.4em]
    ${escapeLatex(header.location)} \\\\
    ${escapeLatex(header.phone)}  $|$  ${hrefLink(`mailto:${header.email}`, header.email)} \\\\
    ${linkLine}
\\end{center}`;
}

function buildProfileSummary(text) {
  return `% PROFILE SUMMARY
\\section*{Profile Summary}
${escapeLatex(text)}`;
}

function buildEducation(entries) {
  const blocks = entries
    .map(
      (entry, index) => `${index > 0 ? '\\vspace{0.2em}\n' : ''}\\noindent
\\textbf{${escapeLatex(entry.degree)}} \\hfill ${escapeLatex(entry.dates)} \\\\
\\textit{${escapeLatex(entry.institution)}}`
    )
    .join('\n\n');

  return `% EDUCATION
\\section*{Education}
${blocks}`;
}

function buildSkills(skills) {
  const lines = [];
  if (skills.technical) {
    lines.push(
      `\\noindent \\textbf{Technical:} ${escapeLatex(skills.technical)} \\\\[0.2em]`
    );
  }
  if (skills.toolsAndPlatforms) {
    lines.push(
      `\\noindent \\textbf{Tools \\& Platforms:} ${escapeLatex(skills.toolsAndPlatforms)} \\\\[0.2em]`
    );
  }
  if (skills.coreCompetencies) {
    lines.push(
      `\\noindent \\textbf{Core Competencies:} ${escapeLatex(skills.coreCompetencies)}`
    );
  }

  return `% SKILLS
\\section*{Skills}
${lines.join('\n')}`;
}

function buildProjects(projects) {
  const blocks = projects
    .map((project, index) => {
      const subtitle = project.subtitle
        ? `\\\\\n\\textit{${escapeLatex(project.subtitle)}}`
        : '';
      const bullets = (project.bullets || [])
        .map((bullet) => `    \\item ${escapeLatex(bullet)}`)
        .join('\n');

      return `${index > 0 ? '\\vspace{0.2em}\n' : ''}\\noindent
\\textbf{${escapeLatex(project.title)}} \\hfill ${escapeLatex(project.dates)}${subtitle}
\\begin{itemize}[leftmargin=0.15in, itemsep=0em, parsep=0pt]
${bullets}
\\end{itemize}`;
    })
    .join('\n\n');

  return `% PROJECTS
\\section*{Projects}
${blocks}`;
}

function buildLeadership(entries) {
  const blocks = entries
    .map((entry, index) => {
      const body = entry.bullets?.length
        ? `\\begin{itemize}[leftmargin=0.15in, itemsep=0em, parsep=0pt]
${entry.bullets.map((b) => `    \\item ${escapeLatex(b)}`).join('\n')}
\\end{itemize}`
        : escapeLatex(entry.description);

      return `${index > 0 ? '\\vspace{0.2em}\n' : ''}\\noindent
\\textbf{${escapeLatex(entry.title)}} \\hfill ${escapeLatex(entry.dates)} \\\\
\\textit{${escapeLatex(entry.organization)}}

\\vspace{0.2em}
\\noindent
${body}`;
    })
    .join('\n\n');

  return `% LEADERSHIP & EXTRACURRICULARS
\\section*{Leadership \\& Extracurriculars}
${blocks}`;
}

const PREAMBLE = `\\documentclass[a4paper,10pt]{article}
\\usepackage[left=0.5in,top=0.4in,right=0.5in,bottom=0.4in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage[utf8]{inputenc}
\\usepackage{mathptmx}
\\usepackage{parskip}

% Colors
\\definecolor{primary}{RGB}{0, 0, 0}
\\definecolor{linkcolor}{RGB}{0, 51, 153}

\\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    filecolor=linkcolor,
    urlcolor=linkcolor,
}

% Formatting section titles
\\titleformat{\\section}{\\large\\bfseries\\color{primary}\\MakeUppercase}{}{0pt}{}[\\vspace{-0.5em}\\rule{\\textwidth}{0.4pt}]
\\titlespacing{\\section}{0pt}{1em}{0.4em}

\\begin{document}
\\pagestyle{empty}
`;

const POSTAMBLE = `
\\end{document}`;

export function buildResumeLatex(resume) {
  const sections = [
    buildHeader(resume.header),
    buildProfileSummary(resume.profileSummary),
    buildEducation(resume.education),
    buildSkills(resume.skills),
    buildProjects(resume.projects),
    buildLeadership(resume.leadership),
  ];

  return `${PREAMBLE}\n\n${sections.join('\n\n')}${POSTAMBLE}`;
}
