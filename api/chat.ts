import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    const { message } = req.body;
    // TODO: Copy your Gemini logic here later
    res.json({ reply: `Echo: ${message}` });
  } else {
    res.json({ status: 'Spur Chat API ready!', endpoints: ['POST /api/chat'] });
  }
}
