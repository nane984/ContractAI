import React, { useEffect, useState, useRef } from "react";
import { api } from "../api/api";

const ChatWindow = ({ activeChatId, setActiveChatId, setRefreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [userInfo, setUserInfo] = useState({
    questions_used: 0,
    monthly_limit: 0
  });

  // Učitavanje user info + token
  useEffect(() => {
    api.get("auth/register/me/")
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Scroll na dno kada se poruke promene
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Učitavanje poruka kad se promeni aktivni chat
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]); // novi chat → prazan chat window
      return;
    }

    api
      .get(`chat/sessions/${activeChatId}/messages/`)
      .then((res) => {
        const mapped = res.data.map(m=>({
          sender: m.role === "assistant" ? "bot" : "user",
          text: m.content
        }));

        setMessages(mapped);
      })
      .catch((err) => console.error(err));
  }, [activeChatId]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Dodaj korisničku poruku lokalno
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let response;

      if (activeChatId) {
        // Slanje poruke u postojeći chat
        response = await api.post(
          `chat/sessions/${activeChatId}/ask/`,
          { prompt: input }
        );
      } else {
        // Novi chat – backend kreira chat_id
        response = await api.post("chat/sessions/ask/", { prompt: input });

        // Postavi ID novog chata u ChatPage
        setActiveChatId(response.data.chat_id);
        // trigger reload sidebar
        setRefreshTrigger(prev => prev + 1);
      }

      const botReply = {
        sender: "bot",
        text: response.data.answer,
      };

      setMessages((prev) => [...prev, botReply]);

      // Uvećaj broj pitanja
      setUserInfo((prev) => ({
        ...prev,
        questions_used: prev.questions_used + 1,
      }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("access");
        window.location.href = "/login";
      }
      const errorMsg = { sender: "bot", text: "Error: could not get response." };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b text-sm text-gray-600">
        <span>Questions: {userInfo.questions_used}</span>
        <span>Limit: {userInfo.monthly_limit}</span>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        ref={chatBoxRef}
        style={{ maxHeight: 'calc(100vh - 200px)' }} // Prilagodi visinu
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex p-4 border-t space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border-gray-300 border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;