import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const quoteRequests: QuoteRequest[] = [];

export const createQuoteRequest = (req: Request, res: Response) => {
  const { name, email, message } = req.body as Partial<QuoteRequest>;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email and message are required.' });
  }

  const quote: QuoteRequest = {
    id: randomUUID(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  quoteRequests.push(quote);
  return res.status(201).json({ message: 'Quote request saved temporarily.', quote });
};

export const getQuoteRequests = (_req: Request, res: Response) => {
  res.json({ count: quoteRequests.length, data: quoteRequests });
};
