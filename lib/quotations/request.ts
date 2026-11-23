import { quoteLimits, quoteServices } from '@/lib/quotations/contracts';

type Body = Record<string, unknown>;

export function acceptsQuoteJson(request: Request) {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  return request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() === 'application/json' &&
    (!origin || origin === new URL(request.url).origin) &&
    fetchSite !== 'cross-site';
}

export async function readQuoteJson(request: Request, limit: number): Promise<Body | null> {
  const declaredSize = Number(request.headers.get('content-length'));
  if (declaredSize > limit || !request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) return null;
      text += decoder.decode(value, { stream: true });
    }
    const data: unknown = JSON.parse(text + decoder.decode());
    return data && typeof data === 'object' && !Array.isArray(data) ? data as Body : null;
  } catch {
    return null;
  } finally {
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

function clean(value: unknown, max: number, multiline = false) {
  if (typeof value !== 'string') return null;
  // Keep ordinary Unicode text and line breaks, dropping control and bidi override characters.
  const controls = /[\p{Cc}\u202A-\u202E\u2066-\u2069]/gu;
  const text = value.normalize('NFC').replace(/\r\n?/g, '\n')
    .replace(controls, character => character === '\n' || character === '\t' ? character : '');
  const result = (multiline ? text : text.replace(/\s+/gu, ' ')).trim();
  return result.length <= max ? result : null;
}

export function isSubmissionId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
}

export function validateQuote(data: Body) {
  if (!isSubmissionId(data.submissionId) || (data.website !== undefined && data.website !== '')) {
    return { error: 'We could not accept this request. Please check the form and try again.' } as const;
  }

  const name = clean(data.name, quoteLimits.name);
  const email = clean(data.email, quoteLimits.email);
  const phone = clean(data.phone, quoteLimits.phone);
  const company = clean(data.company ?? '', quoteLimits.company);
  const message = clean(data.message, quoteLimits.message, true);
  const service = quoteServices.find(option => option === data.service);

  if (!name) return { error: 'Enter your name (up to 100 characters).' } as const;
  if (!email || !/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/.test(email)) {
    return { error: 'Enter a valid email address.' } as const;
  }
  if (!phone || !/^\+?[0-9(). -]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
    return { error: 'Enter a phone number with 7 to 15 digits.' } as const;
  }
  if (company === null) return { error: 'Enter a company name of up to 150 characters.' } as const;
  if (!service) return { error: 'Choose a service from the list.' } as const;
  if (!message) return { error: 'Enter a project message (up to 4,000 characters).' } as const;

  return { id: data.submissionId, details: { name, email, phone, company, service, message } } as const;
}
