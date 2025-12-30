// import { Router, Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';
// import { generateReply } from '../services/llm';
// import { ChatRequest, ChatResponse, ChatMessage, Sender } from '../types';
// import { createConversation, getConversationHistory, saveMessage } from '../db';

// const router = Router();

// router.post('/message', async (req: Request, res: Response<ChatResponse>) => {
//   try {
//     const { message, sessionId }: ChatRequest = req.body;

//     // Input validation
//     if (!message?.trim()) {
//       return res.status(400).json({ reply: 'Please enter a message.', sessionId: '' });
//     }

//     if (message.trim().length > 1000) {
//       return res.status(400).json({ reply: 'Message too long (max 1000 chars).', sessionId: '' });
//     }

//     // Get or create conversation
//     const convId = sessionId || createConversation();
//     const history = getConversationHistory(convId);

//     // Save user message
//     const userMessage: ChatMessage = {
//       id: uuidv4(),
//       conversationId: convId,
//       sender: 'user',
//       text: message.trim(),
//       createdAt: new Date().toISOString(),
//     };
//     saveMessage(userMessage);

//     // Generate AI reply
//     const reply = await generateReply(history, message.trim());

//     // Save AI message
//     const aiMessage: ChatMessage = {
//       id: uuidv4(),
//       conversationId: convId,
//       sender: 'ai',
//       text: reply,
//       createdAt: new Date().toISOString(),
//     };
//     saveMessage(aiMessage);

//     res.json({ reply, sessionId: convId });
//   } catch (error: any) {
//     console.error('Chat error:', error);
//     res.status(500).json({ reply: error.message || 'Something went wrong.', sessionId: '' });
//   }
// });

// export default router;

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateReply } from '../services/llm';
import { ChatRequest, ChatResponse, ChatMessage, Sender } from '../types';
import { createConversation, getConversationHistory, saveMessage } from '../db';

const router = Router();

// ✅ GET conversation history
router.get('/history/:convId', (req: Request, res: Response) => {
  try {
    const { convId } = req.params;
    
    if (!convId) {
      return res.status(400).json({ messages: [], error: 'Conversation ID required' });
    }

    console.log('📚 Loading history for:', convId);
    const history = getConversationHistory(convId);
    
    res.json({ 
      messages: history,
      count: history.length,
      conversationId: convId 
    });
  } catch (error: any) {
    console.error('History error:', error.message);
    res.status(404).json({ messages: [], error: 'Conversation not found' });
  }
});

// ✅ POST new message
router.post('/message', async (req: Request, res: Response<ChatResponse>) => {
  try {
    const { message, sessionId }: ChatRequest = req.body;

    // Input validation
    if (!message?.trim()) {
      return res.status(400).json({ reply: 'Please enter a message.', sessionId: '' });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ reply: 'Message too long (max 1000 chars).', sessionId: '' });
    }

    console.log('💬 New message:', message.substring(0, 50) + '...');

    // Get or create conversation
    const convId = sessionId || createConversation();
    const history = getConversationHistory(convId);

    // Save user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: convId,
      sender: 'user',
      text: message.trim(),
      createdAt: new Date().toISOString(),
    };
    saveMessage(userMessage);

    // Generate AI reply
    const reply = await generateReply(history, message.trim());

    // Save AI message
    const aiMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: convId,
      sender: 'ai',
      text: reply,
      createdAt: new Date().toISOString(),
    };
    saveMessage(aiMessage);

    console.log('✅ Reply sent, conversation:', convId);
    
    res.json({ reply, sessionId: convId });
  } catch (error: any) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ 
      reply: error.message || 'Something went wrong. Please try again.',
      sessionId: ''
    });
  }
});

export default router;
