import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
  getMessagesByUserId(selectedUser._id);
  subscribeToMessages();

  //cleanup
  return() => unsubscribeFromMessages();
}, [selectedUser._id, getMessagesByUserId, subscribeToMessages,
    unsubscribeFromMessages,]); // ✅ Use selectedUser._id instead


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">

      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="space-y-3 md:space-y-6 md:max-w-3xl md:mx-auto">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === authUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`rounded-xl px-3 py-2 max-w-[75%] md:max-w-[60%] ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg mb-2 max-h-48 object-cover"
                    />
                  )}

                  {msg.text && <p className="text-sm">{msg.text}</p>}

                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}


export default ChatContainer;