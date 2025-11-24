import React, { useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { HiOutlineMenu } from "react-icons/hi"; // hamburger ikona, install: react-icons


const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="flex flex-1 overflow-hidden relative">
      
      {/* Hamburger dugme za mobilni */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <HiOutlineMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`
          bg-white shadow-lg p-4 overflow-y-auto max-h-screen
          md:w-64 md:flex md:relative sidebar
          fixed inset-y-0 left-0 z-40 transform 
           ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        `}
      >
        <ChatSidebar 
          activeChatId={activeChatId}  
          setActiveChatId={(id) => {
            setActiveChatId(id);
            setSidebarOpen(false); // automatski zatvaranje sidebar-a
          }} 
          refreshTrigger={refreshTrigger}/>
      </div>

      {/* Overlay kada je sidebar otvoren na mobilnom */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex justify-center p-4 pt-16 md:pt-4">
          <div className="w-full md:w-[70%] flex flex-col" >
            <ChatWindow activeChatId={activeChatId} setActiveChatId={setActiveChatId} setRefreshTrigger={setRefreshTrigger}/>
          </div>
      </div>
    </div>
  );
};

export default ChatPage;
