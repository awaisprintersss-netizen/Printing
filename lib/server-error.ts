export function logServerError(operation: string, error: unknown) {
  // Keep stack frames and driver messages, but never log a full MongoDB URI.
  const detail = error instanceof Error
    ? (error.stack ?? error.message).replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[redacted MongoDB URI]')
    : 'Non-Error exception';
  console.error(operation, detail);
}

export function serverError(operation: string, error: unknown) {
  logServerError(operation, error);
  return Response.json({ success: false, error: 'Request failed. Please try again.' }, { status: 500 });
}
