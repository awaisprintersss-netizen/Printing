export async function readGalleryRequest(request: Request, limit: number) {
  const tooLarge = { status: 413 } as const;
  const invalid = { status: 400 } as const;

  if (Number(request.headers.get('content-length')) > limit) return tooLarge;
  if (!request.body) return invalid;

  const reader = request.body.getReader();
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        void reader.cancel().catch(() => {});
        return tooLarge;
      }
      chunks.push(Buffer.from(value));
    }
  } catch {
    return invalid;
  } finally {
    reader.releaseLock();
  }

  const contentType = request.headers.get('content-type');
  const headers = contentType ? { 'Content-Type': contentType } : undefined;
  return { status: 200, body: new Response(new Uint8Array(Buffer.concat(chunks, size)), { headers }) } as const;
}
