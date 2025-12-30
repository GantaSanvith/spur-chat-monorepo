import { ChatMessage } from '../types';

export async function generateReply(history: ChatMessage[], userMessage: string): Promise<string> {
  // Context-aware responses
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return 'Our 30-day money-back guarantee applies to unused items with tags attached. Contact support@spurstore.com to start your return.';
  }
  if (lowerMsg.includes('ship') || lowerMsg.includes('delivery')) {
    return 'Free worldwide shipping on orders over $50. Domestic: 3-5 business days. International: 7-14 days.';
  }
  if (lowerMsg.includes('support') || lowerMsg.includes('hours')) {
    return '24/7 AI support available. Human support Mon-Fri 9AM-6PM EST.';
  }
  
  return `Thanks for your question about "${userMessage}"! We're a small e-commerce store powered by Spur. How else can I help you today?`;
}
