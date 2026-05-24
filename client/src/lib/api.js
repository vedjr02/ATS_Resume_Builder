export function downloadPdfFromBase64(pdfBase64) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tailored_resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateResume(jobDescription, currentResume, onStatus) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription, currentResume }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Streaming not supported by the browser.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;
  let error = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.type === 'status') {
          onStatus(payload.step, payload.message);
        } else if (payload.type === 'result') {
          result = payload;
        } else if (payload.type === 'error') {
          error = payload.message;
        }
      } catch {
        // ignore malformed SSE chunks
      }
    }
  }

  if (error) throw new Error(error);
  if (!result || result.status !== 'success') {
    throw new Error('Generation failed. Please try again.');
  }

  return result;
}
