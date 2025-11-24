import React, { useEffect, useState } from "react";
import { api } from "../api/api";

const ChatSidebar = ({ activeChatId, setActiveChatId, refreshTrigger }) => {
  const [chats, setChats] = useState([]);

  const loadChats = () => {
    api.get("chat/sessions/")
      .then(res => setChats(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadChats();
  }, [refreshTrigger]);

  return (
    <div className="w-full h-full flex flex-col">
      <button
        className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700 transition"
        onClick={() => setActiveChatId(null)}
      >
        + New chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`p-3 rounded cursor-pointer mb-2 transition
              ${activeChatId === chat.id ? "bg-blue-200" : "bg-gray-100 hover:bg-blue-100"}`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
