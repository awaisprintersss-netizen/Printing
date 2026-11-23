import { withGalleryAdmin } from '@/lib/gallery-admin';
import { isQuoteStatus } from '@/lib/quotations/contracts';
import { acceptsQuoteJson, isSubmissionId, readQuoteJson } from '@/lib/quotations/request';
import { listQuotations, updateQuotationStatus } from '@/lib/quotations/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store' };

export const GET = withGalleryAdmin('Quotation inbox read failed', async (request) => {
  const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
  if (!Number.isInteger(page) || page < 1 || page > 5000) {
    return Response.json({ error: 'Invalid inbox page.' }, { status: 400 });
  }

  const result = await listQuotations(page);
  return Response.json({ ...result, hasNext: result.hasNext && page < 5000 }, { headers: privateHeaders });
});

export const PATCH = withGalleryAdmin('Quotation status update failed', async (request) => {
  if (!acceptsQuoteJson(request)) {
    return Response.json({ error: 'Use the quotation inbox to update status.' }, { status: 400 });
  }
  const data = await readQuoteJson(request, 1024);
  if (!data || !isSubmissionId(data.id) || !isQuoteStatus(data.status) ||
      typeof data.version !== 'number' || !Number.isSafeInteger(data.version) || data.version < 0) {
    return Response.json({ error: 'Select a valid quotation and status.' }, { status: 400 });
  }

  const result = await updateQuotationStatus(data.id, data.status, data.version);
  if (result === 'missing') return Response.json({ error: 'Quotation not found.' }, { status: 404 });
  if (result === 'conflict') {
    return Response.json({ error: 'This quotation was updated elsewhere. Refresh the inbox and try again.' }, { status: 409 });
  }
  return Response.json({ status: data.status, version: data.version + 1 }, { headers: privateHeaders });
});
