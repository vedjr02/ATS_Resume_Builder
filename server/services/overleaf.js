const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function getOverleafCredentials() {
  const sessionCookie = process.env.OVERLEAF_SESSION_COOKIE;
  const gclbToken = process.env.OVERLEAF_GCLB_TOKEN;

  if (!sessionCookie || !gclbToken) {
    throw new Error(
      'Overleaf credentials not configured. Please set environment variables.'
    );
  }

  return {
    sessionCookie: decodeURIComponent(sessionCookie),
    gclbToken,
  };
}

function buildCookieHeader(sessionCookie, gclbToken) {
  return `overleaf_session2=${sessionCookie}; GCLB=${gclbToken}`;
}

function extractCsrfToken(html) {
  const match =
    html.match(/name="ol-csrfToken" content="([^"]+)"/) ||
    html.match(/content="([^"]+)" name="ol-csrfToken"/);

  if (!match?.[1]) {
    throw new Error('Overleaf session expired. Please refresh your session cookie.');
  }

  return match[1];
}

export async function fetchCsrfToken() {
  const { sessionCookie, gclbToken } = getOverleafCredentials();

  const response = await fetch('https://www.overleaf.com/project', {
    headers: {
      'User-Agent': USER_AGENT,
      Cookie: buildCookieHeader(sessionCookie, gclbToken),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to connect to Overleaf. Check your session cookies.');
  }

  const html = await response.text();
  const csrfToken = extractCsrfToken(html);

  return { csrfToken, sessionCookie, gclbToken };
}

export async function createProject(latexCode, csrfToken, sessionCookie, gclbToken) {
  const body = new URLSearchParams({
    _csrf: csrfToken,
    snip: latexCode,
    engine: 'pdflatex',
  });

  const response = await fetch('https://www.overleaf.com/docs', {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      Referer: 'https://www.overleaf.com/project',
      Origin: 'https://www.overleaf.com',
      'User-Agent': USER_AGENT,
      Cookie: buildCookieHeader(sessionCookie, gclbToken),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const locationHeader = response.headers.get('location');
  if (!locationHeader) {
    throw new Error('Overleaf did not return a project URL. Session may be expired.');
  }

  const projectIdMatch = locationHeader.match(/\/project\/([a-f0-9]{24})/);
  if (!projectIdMatch?.[1]) {
    throw new Error('Could not extract Overleaf project ID from redirect.');
  }

  return projectIdMatch[1];
}

export async function compileProject(projectId, csrfToken, sessionCookie, gclbToken) {
  const body = new URLSearchParams({
    check: 'silent',
    draft: 'true',
    stopOnFirstError: 'false',
  });

  const response = await fetch(
    `https://www.overleaf.com/project/${projectId}/compile`,
    {
      method: 'POST',
      headers: {
        Cookie: buildCookieHeader(sessionCookie, gclbToken),
        'X-Csrf-Token': csrfToken,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      },
      body: body.toString(),
    }
  );

  if (!response.ok) {
    const projectUrl = `https://www.overleaf.com/project/${projectId}`;
    throw new Error(
      `Overleaf compilation request failed. Open the project to view logs: ${projectUrl}`
    );
  }

  const data = await response.json();
  const projectUrl = `https://www.overleaf.com/project/${projectId}`;
  const pdfFile = data.outputFiles?.find((f) => f.path === 'output.pdf');

  if (!pdfFile?.url) {
    throw new Error(
      `PDF compilation failed. Open the project in Overleaf to debug: ${projectUrl}`
    );
  }

  if (!data.pdfDownloadDomain || !data.compileGroup || !data.clsiServerId) {
    throw new Error(
      `Overleaf compile response missing download metadata. Open the project in Overleaf: ${projectUrl}`
    );
  }

  const pdfUrl = buildPdfDownloadUrl(data.pdfDownloadDomain, pdfFile.url, {
    compileGroup: data.compileGroup,
    clsiServerId: data.clsiServerId,
  });

  return {
    pdfUrl,
    projectUrl,
  };
}

function buildPdfDownloadUrl(pdfDownloadDomain, outputPath, { compileGroup, clsiServerId }) {
  const params = new URLSearchParams({
    compileGroup,
    clsiserverid: clsiServerId,
    pdfng: 'true',
  });

  return `${pdfDownloadDomain}${outputPath}?${params.toString()}`;
}

export async function downloadPdf(pdfUrl, sessionCookie, gclbToken, projectUrl) {
  const response = await fetch(pdfUrl, {
    headers: {
      Cookie: buildCookieHeader(sessionCookie, gclbToken),
      'User-Agent': USER_AGENT,
      Referer: projectUrl,
      Accept: 'application/pdf,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download compiled PDF from Overleaf. Open the project to debug: ${projectUrl}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 4 || buffer.subarray(0, 4).toString() !== '%PDF') {
    throw new Error(
      `Overleaf returned an invalid PDF. Open the project to debug: ${projectUrl}`
    );
  }

  return buffer.toString('base64');
}

export async function compileLatexToPdf(latexCode) {
  const { csrfToken, sessionCookie, gclbToken } = await fetchCsrfToken();
  const projectId = await createProject(latexCode, csrfToken, sessionCookie, gclbToken);
  const { pdfUrl, projectUrl } = await compileProject(
    projectId,
    csrfToken,
    sessionCookie,
    gclbToken
  );
  const pdfBase64 = await downloadPdf(pdfUrl, sessionCookie, gclbToken, projectUrl);

  return { pdfUrl, projectUrl, pdfBase64 };
}
