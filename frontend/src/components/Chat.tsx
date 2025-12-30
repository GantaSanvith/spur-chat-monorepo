// import React, { useState, useRef, useEffect } from "react";
// import "./Chat.css";

// type Sender = "user" | "ai";

// interface ChatMessage {
//   id: string;
//   sender: Sender;
//   text: string;
//   createdAt: string;
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [sessionId, setSessionId] = useState<string | null>(null); // ✅ ADDED
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // ✅ Load session on mount
//   useEffect(() => {
//     const savedSession = localStorage.getItem('chatSessionId');
//     if (savedSession) {
//       setSessionId(savedSession);
//       console.log('📱 Loaded session:', savedSession);
//     }
//   }, []);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed) return;

//     const userMessage: ChatMessage = {
//       id: crypto.randomUUID(),
//       sender: "user",
//       text: trimmed,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsSending(true);

//     try {
//       const response = await fetch('http://localhost:4000/chat/message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           message: trimmed, 
//           sessionId: sessionId || undefined  // ✅ PASS SESSION ID
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Backend error: ${response.status}`);
//       }

//       const data = await response.json();

//       const aiMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         sender: "ai",
//         text: data.reply,
//         createdAt: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
      
//       // ✅ SAVE SESSION ID
//       localStorage.setItem('chatSessionId', data.sessionId);
//       setSessionId(data.sessionId);
//       console.log('✅ New session:', data.sessionId);

//     } catch (error) {
//       console.error('Backend error:', error);
//       const errorMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         sender: "ai",
//         text: "Sorry, I'm having trouble connecting. Please try again.",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (!isSending) {
//         handleSend();
//       }
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         <div className="chat-messages">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={
//                 msg.sender === "user" ? "message-row user" : "message-row ai"
//               }
//             >
//               <div className="message-bubble">
//                 <div className="message-sender">
//                   {msg.sender === "user" ? "You" : "Support"}
//                 </div>
//                 <div className="message-text">{msg.text}</div>
//               </div>
//             </div>
//           ))}
//           {isSending && (
//             <div className="message-row ai">
//               <div className="message-bubble typing-bubble">
//                 <div className="message-sender">Support</div>
//                 <div className="typing-indicator">
//                   <span />
//                   <span />
//                   <span />
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="chat-input-row">
//           <input
//             className="chat-input"
//             placeholder="Ask about shipping, returns, etc..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={isSending}
//           />
//           <button
//             className="chat-send-button"
//             onClick={handleSend}
//             disabled={isSending || !input.trim()}
//           >
//             {isSending ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import "./Chat.css";

// type Sender = "user" | "ai";

// interface ChatMessage {
//   id: string;
//   sender: Sender;
//   text: string;
//   createdAt: string;
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Load session on mount (runs once)
//   useEffect(() => {
//     const savedSession = localStorage.getItem('chatSessionId');
//     if (savedSession) {
//       setSessionId(savedSession);
//       console.log('📱 Loaded session:', savedSession);
//     }
//   }, []);

//   // ✅ FIXED: Load history ONLY when sessionId changes (NO LOOP!)
//   useEffect(() => {
//     if (sessionId) {
//       console.log('📱 Loading history for session:', sessionId);
//       fetch(`http://localhost:4000/chat/history/${sessionId}`)
//         .then((res) => {
//           if (!res.ok) throw new Error('Failed to load history');
//           return res.json();
//         })
//         .then((data) => {
//           console.log('📚 Loaded history:', data.messages?.length || 0, 'messages');
//           setMessages(data.messages || []);
//         })
//         .catch((error) => {
//           console.log('ℹ️ No history found (new chat)');
//           setMessages([]);
//         });
//     }
//   }, [sessionId]); // ✅ ONLY sessionId dependency - NO LOOP!

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = useCallback(async () => {
//     const trimmed = input.trim();
//     if (!trimmed || isSending) return;

//     const userMessage: ChatMessage = {
//       id: crypto.randomUUID(),
//       sender: "user",
//       text: trimmed,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsSending(true);

//     try {
//       const response = await fetch('http://localhost:4000/chat/message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           message: trimmed, 
//           sessionId: sessionId || undefined
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Backend error: ${response.status}`);
//       }

//       const data = await response.json();

//       const aiMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         sender: "ai",
//         text: data.reply,
//         createdAt: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
      
//       // Save session ID
//       localStorage.setItem('chatSessionId', data.sessionId);
//       setSessionId(data.sessionId);
//       console.log('✅ New session:', data.sessionId);

//     } catch (error) {
//       console.error('Backend error:', error);
//       const errorMessage: ChatMessage = {
//         id: crypto.randomUUID(),
//         sender: "ai",
//         text: "Sorry, I'm having trouble connecting. Please try again.",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsSending(false);
//     }
//   }, [input, isSending, sessionId]);

//   const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const clearChat = () => {
//     setMessages([]);
//     setSessionId(null);
//     localStorage.removeItem('chatSessionId');
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         <div className="chat-header">
//           <span>🤖 Spur Support</span>
//           {messages.length > 0 && (
//             <button onClick={clearChat} className="clear-button" title="Start new chat">
//               Clear
//             </button>
//           )}
//         </div>
        
//         <div className="chat-messages">
//           {messages.length === 0 && !isSending && (
//             <div className="welcome-message">
//               <div className="message-text">
//                 Hi! Ask me about shipping, returns, or support hours.
//               </div>
//             </div>
//           )}
          
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`message-row ${msg.sender}`}
//             >
//               <div className="message-bubble">
//                 <div className="message-sender">
//                   {msg.sender === "user" ? "You" : "Support"}
//                 </div>
//                 <div className="message-text">{msg.text}</div>
//               </div>
//             </div>
//           ))}
          
//           {isSending && (
//             <div className="message-row ai">
//               <div className="message-bubble typing-bubble">
//                 <div className="message-sender">Support</div>
//                 <div className="typing-indicator">
//                   <span />
//                   <span />
//                   <span />
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="chat-input-row">
//           <input
//             className="chat-input"
//             placeholder="Ask about shipping, returns, support hours..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={isSending}
//           />
//           <button
//             className="chat-send-button"
//             onClick={handleSend}
//             disabled={isSending || !input.trim()}
//           >
//             {isSending ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;


import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Chat.css";

type Sender = "user" | "ai";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
}

const API_URL = 'https://spur-chat-backend1.onrender.com'; // ✅ FIXED: Render backend!

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load session on mount (runs once)
  useEffect(() => {
    const savedSession = localStorage.getItem('chatSessionId');
    if (savedSession) {
      setSessionId(savedSession);
      console.log('📱 Loaded session:', savedSession);
    }
  }, []);

  // ✅ FIXED: Load history ONLY when sessionId changes (NO LOOP!)
  useEffect(() => {
    if (sessionId) {
      console.log('📱 Loading history for session:', sessionId);
      fetch(`${API_URL}/chat/history/${sessionId}`) // ✅ FIXED: Render URL
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load history');
          return res.json();
        })
        .then((data) => {
          console.log('📚 Loaded history:', data.messages?.length || 0, 'messages');
          setMessages(data.messages || []);
        })
        .catch((error) => {
          console.log('ℹ️ No history found (new chat)');
          setMessages([]);
        });
    }
  }, [sessionId]); // ✅ ONLY sessionId dependency - NO LOOP!

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_URL}/chat/message`, { // ✅ FIXED: Render URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: trimmed, 
          sessionId: sessionId || undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Save session ID
      localStorage.setItem('chatSessionId', data.sessionId);
      setSessionId(data.sessionId);
      console.log('✅ New session:', data.sessionId);

    } catch (error) {
      console.error('Backend error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Sorry, I'm having trouble connecting. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, sessionId]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem('chatSessionId');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">
          <span>🤖 Spur Support</span>
          {messages.length > 0 && (
            <button onClick={clearChat} className="clear-button" title="Start new chat">
              Clear
            </button>
          )}
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 && !isSending && (
            <div className="welcome-message">
              <div className="message-text">
                Hi! Ask me about shipping, returns, or support hours.
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${msg.sender}`}
            >
              <div className="message-bubble">
                <div className="message-sender">
                  {msg.sender === "user" ? "You" : "Support"}
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="message-row ai">
              <div className="message-bubble typing-bubble">
                <div className="message-sender">Support</div>
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask about shipping, returns, support hours..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <button
            className="chat-send-button"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
