export const quoteServices = [
  'Business Cards', 'Brochures & Flyers', 'Banners & Signage', 'Packaging',
  'Labels & Stickers', 'Letterheads', 'Catalogs', 'Presentation Folders',
  'Leather Patches', 'Woven Labels', 'Hang Tags', 'Screen Printing',
  'Offset Printing', 'Digital Printing', 'Foil Stamping', 'Embossing',
  'Die Cutting', 'Lamination',
] as const;

export const quoteStatusLabels = {
  new: 'New',
  contacted: 'Contacted',
  completed: 'Completed',
} as const;

export type QuoteStatus = keyof typeof quoteStatusLabels;

export const quoteLimits = { name: 100, email: 254, phone: 32, company: 150, message: 4000 };

export interface QuoteDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export interface InboxQuotation extends QuoteDetails {
  id: string;
  status: QuoteStatus;
  submittedAt: string;
  version: number;
}

export function isQuoteStatus(value: unknown): value is QuoteStatus {
  return typeof value === 'string' && Object.hasOwn(quoteStatusLabels, value);
}
