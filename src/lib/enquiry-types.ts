/** Same keys as the website's enquiry form (src/lib/enquiry.ts on the website). */
export const ENQUIRY_TYPES: Record<string, string> = { quote: 'Quote request', demo: 'Demo request', sales: 'Sales enquiry', service: 'Service enquiry' };

export const ENQUIRY_STATUSES = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['requirement', 'Requirement Identified'],
  ['meeting', 'Meeting Scheduled'],
  ['quotation', 'Quotation Submitted'],
  ['negotiation', 'Negotiation'],
  ['won', 'Won'],
  ['lost', 'Lost'],
  ['followup', 'Follow-up Pending'],
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number][0];
export const ENQUIRY_STATUS_LABEL: Record<string, string> = { ...Object.fromEntries(ENQUIRY_STATUSES), closed: 'Closed (old)' };
