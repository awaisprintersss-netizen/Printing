import Link from 'next/link';
import { QuotationInbox } from '@/app/components/admin/QuotationInbox';

export const dynamic = 'force-dynamic';

export default function QuotationsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav aria-label="Admin sections" className="flex flex-wrap gap-6 border-b border-light mb-8">
        <Link href="/admin" className="text-secondary hover:text-primary px-1 pb-4 text-sm font-medium">
          Gallery Management
        </Link>
        <Link href="/admin/quotations" aria-current="page" className="border-b-2 border-accent text-primary px-1 pb-4 text-sm font-medium">
          Quotation Inbox
        </Link>
      </nav>
      <h2 className="text-3xl font-bold text-primary mb-2">Quotation Inbox</h2>
      <p className="text-secondary mb-6">Review requests and update their status as you follow up.</p>
      <QuotationInbox />
    </section>
  );
}
