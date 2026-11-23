import { acceptsQuoteJson, readQuoteJson, validateQuote } from '@/lib/quotations/request';
import { submitQuotation } from '@/lib/quotations/store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!acceptsQuoteJson(request)) {
    return Response.json({ error: 'Submit the quotation using the contact form.' }, { status: 400 });
  }

  const body = await readQuoteJson(request, 24 * 1024);
  if (!body) return Response.json({ error: 'The quotation is invalid or too large.' }, { status: 400 });
  const quotation = validateQuote(body);
  if ('error' in quotation) return Response.json({ error: quotation.error }, { status: 400 });

  try {
    const result = await submitQuotation(request, quotation.id, quotation.details);
    if (result.kind === 'created' || result.kind === 'duplicate') {
      return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (result.kind === 'limited') {
      return Response.json(
        { error: 'Too many requests. Please wait and try again, or contact us by phone or WhatsApp.' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } },
      );
    }
    return Response.json({ error: 'This submission could not be retried. Refresh the page and try again.' }, { status: 409 });
  } catch (error) {
    // Driver errors can contain submitted content. Log the type only.
    console.error('Quotation submission failed', error instanceof Error ? error.name : 'Unknown error');
    return Response.json({ error: 'We could not accept your quotation right now. Please try again.' }, { status: 503 });
  }
}
