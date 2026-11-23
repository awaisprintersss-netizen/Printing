"use client";

import { useEffect, useState } from 'react';
import { isQuoteStatus, quoteStatusLabels, type InboxQuotation } from '@/lib/quotations/contracts';

const dateFormat = new Intl.DateTimeFormat('en-PK', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Karachi',
});

const buttonClass = 'px-4 py-2 rounded-lg border border-light text-primary hover:bg-page-tertiary disabled:opacity-50';

function QuotationCard({ item, onUpdate }: {
  item: InboxQuotation;
  onUpdate: (item: InboxQuotation) => void;
}) {
  const [status, setStatus] = useState(item.status);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ error?: string; message?: string }>({});

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || status === item.status) return;
    setSaving(true);
    setFeedback({});
    try {
      const response = await fetch('/api/admin/quotations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status, version: item.version }),
      });
      const result = await response.json();
      if (!response.ok) {
        setFeedback({ error: result.error || 'Status could not be saved.' });
        return;
      }
      onUpdate({ ...item, status: result.status, version: result.version });
      setFeedback({ message: 'Status saved.' });
    } catch {
      setFeedback({ error: 'Status could not be saved. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="min-w-0 rounded-xl border border-light bg-page-secondary p-5 sm:p-6">
      <div className="flex flex-wrap justify-between gap-3">
        <h3 className="text-lg font-semibold text-primary break-words">{item.service}</h3>
        <p className="text-sm text-secondary">
          <time dateTime={item.submittedAt}>{dateFormat.format(new Date(item.submittedAt))}</time> PKT
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 mt-4 text-sm">
        <div className="min-w-0"><dt className="text-secondary">Name</dt><dd className="text-primary break-words">{item.name}</dd></div>
        <div className="min-w-0"><dt className="text-secondary">Email</dt><dd className="text-primary break-all">{item.email}</dd></div>
        <div className="min-w-0"><dt className="text-secondary">Phone</dt><dd className="text-primary break-words">{item.phone}</dd></div>
        {item.company && <div className="min-w-0"><dt className="text-secondary">Company</dt><dd className="text-primary break-words">{item.company}</dd></div>}
      </dl>
      <p className="text-sm text-secondary mt-4">Message</p>
      <p className="whitespace-pre-wrap break-words text-primary mt-1">{item.message}</p>
      <form onSubmit={save} className="flex flex-wrap items-center gap-3 mt-5">
        <label htmlFor={item.id} className="text-sm text-primary">Status</label>
        <select
          id={item.id}
          value={status}
          disabled={saving}
          onChange={event => {
            if (isQuoteStatus(event.target.value)) setStatus(event.target.value);
            setFeedback({});
          }}
          className="rounded-lg border border-light bg-page-primary text-primary px-3 py-2"
        >
          {Object.entries(quoteStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="submit" disabled={saving || status === item.status} className={buttonClass}>
          {saving ? 'Saving…' : 'Save status'}
        </button>
        {feedback.error && <p role="alert" className="text-sm text-primary">{feedback.error}</p>}
        {feedback.message && <p role="status" className="text-sm text-primary">{feedback.message}</p>}
      </form>
    </article>
  );
}

export function QuotationInbox() {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [items, setItems] = useState<InboxQuotation[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/admin/quotations?page=${page}`, {
          cache: 'no-store', signal: controller.signal,
        });
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setError(result.error || 'The inbox could not be loaded.');
          return;
        }
        setItems(result.items);
        setHasNext(result.hasNext);
      } catch {
        if (!controller.signal.aborted) setError('The inbox could not be loaded.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [page, attempt]);

  function loadPage(nextPage: number) {
    setError('');
    setLoading(true);
    setItems([]);
    if (nextPage === page) setAttempt(value => value + 1);
    else setPage(nextPage);
  }

  return (
    <div className="space-y-4" aria-busy={loading}>
      <button onClick={() => loadPage(page)} disabled={loading} className={buttonClass}>Refresh inbox</button>
      {loading && <p role="status" className="text-secondary">Loading quotations…</p>}
      {error && <p role="alert" className="text-primary">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-secondary">No quotations on this page.</p>}
      {!loading && !error && items.map(item => (
        <QuotationCard key={item.id} item={item} onUpdate={updated => setItems(current => (
          current.map(record => record.id === updated.id ? updated : record)
        ))} />
      ))}
      {!loading && !error && (page > 1 || hasNext) && (
        <nav aria-label="Inbox pages" className="flex flex-wrap items-center gap-3">
          <button disabled={page === 1} onClick={() => loadPage(page - 1)} className={buttonClass}>Previous</button>
          <span className="text-sm text-secondary">Page {page}</span>
          <button disabled={!hasNext} onClick={() => loadPage(page + 1)} className={buttonClass}>Next</button>
        </nav>
      )}
    </div>
  );
}
