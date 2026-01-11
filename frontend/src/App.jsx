import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/chat";

export default function App() {
  const [userId] = useState("user123");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;
    setMessages(prev => [...prev, { role: "user", text: currentInput }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(BACKEND_URL, {
        userId,
        message: currentInput,
      });

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "❌ Server error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      {/* FIXED HEIGHT CHAT CARD */}
      <div className="w-full max-w-md h-140 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-4 py-3 border-b text-center font-semibold bg-gray-50 shrink-0">
          🤖 STAN Chatbot
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar */}
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm shrink-0">
                  B
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed wrap-break-word ${
                  msg.role === "user"
                    ? "bg-green-200 rounded-br-none"
                    : "bg-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm shrink-0">
                  U
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400 italic">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm shrink-0">
                B
              </div>
              <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                Bot is typing…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2 bg-gray-50 shrink-0">
          <input
            className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
