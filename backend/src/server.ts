// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import chatRoutes from './routes/chat';

// // Load environment variables
// dotenv.config();

// console.log('🔑 Gemini key loaded:', process.env.GOOGLE_GEMINI_API_KEY ? 'YES' : 'NO');

// const app = express();
// const PORT = process.env.PORT || 4000 || 10000; // Render uses 10000

// // Middleware - FIXED: CORS for ALL origins (Netlify + Render)
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://*.netlify.app', 'https://*.vercel.app'],
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));

// // ROOT ROUTE - FIXED: Shows backend status
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Spur Chat Backend Live! 🚀',
//     endpoints: ['/health', '/chat'],
//     gemini: process.env.GOOGLE_GEMINI_API_KEY ? 'Loaded ✅' : 'Missing ❌',
//     port: PORT
//   });
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     gemini: process.env.GOOGLE_GEMINI_API_KEY ? 'Ready' : 'Missing key'
//   });
// });

// // Chat routes
// app.use('/chat', chatRoutes);

// // 404 handler - AFTER all routes
// app.use((req, res) => {
//   res.status(404).json({ 
//     error: 'Route not found', 
//     available: ['/', '/health', '/chat'] 
//   });
// });

// // Error handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Health: http://localhost:${PORT}/health`);
//   console.log(`🌐 Root: http://localhost:${PORT}/`);
// });



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';

// Load environment variables
dotenv.config();

console.log('🔑 Gemini key loaded:', process.env.GOOGLE_GEMINI_API_KEY ? 'YES' : 'NO');

const app = express();
const PORT = process.env.PORT || 4000 || 10000; // Render uses 10000

// ✅ FIXED CORS: ALL Netlify + YOUR SITES
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://snazzy-meerkat-496e3e.netlify.app',     // ✅ YOUR NEW SITE
    'https://profound-taffy-e74e35.netlify.app',     // ✅ OLD SITE
    'https://*.netlify.app',                         // ✅ ALL Netlify
    'https://*.vercel.app'                           // ✅ Vercel too
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ROOT ROUTE - Backend status
app.get('/', (req, res) => {
  res.json({ 
    message: 'Spur Chat Backend Live! 🚀',
    endpoints: ['/health', '/chat/message', '/chat/history/:sessionId'],
    gemini: process.env.GOOGLE_GEMINI_API_KEY ? 'Loaded ✅' : 'Missing ❌',
    port: PORT,
    cors: 'Enabled for Netlify ✅'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    gemini: process.env.GOOGLE_GEMINI_API_KEY ? 'Ready ✅' : 'Missing ❌',
    cors: 'Enabled ✅'
  });
});

// Chat routes
app.use('/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    available: ['/', '/health', '/chat/message', '/chat/history/:id'] 
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Root: http://localhost:${PORT}/`);
  console.log(`💬 Chat: http://localhost:${PORT}/chat/message`);
});
