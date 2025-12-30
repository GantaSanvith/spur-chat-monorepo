import React from "react";
import "./App.css";
import Chat from "./components/Chat";
const App: React.FC = () => {
  return (
    <div className="app">
      <div className="app-header">Spur Mini Support Chat</div>
      <Chat />
    </div>
  );
};

export default App;
