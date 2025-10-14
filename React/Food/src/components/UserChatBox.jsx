import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

function UserChatBox({ userId = "54" }) {
  const ADMIN_ID = "55"; // use actual admin id from DB
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const connectionRef = useRef(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7076/chatHub?userId=${userId}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => {
        console.log("✅ Connected (User)");
        fetch(`https://localhost:7076/api/chat/history/${userId}/${ADMIN_ID}`)
          .then((res) => res.json())
          .then((data) => setMessages(data));
      })
      .catch((err) => console.error("SignalR connection error:", err));

    conn.on("ReceiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    connectionRef.current = conn;
    return () => conn.stop();
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await connectionRef.current.invoke(
        "SendMessage",
        userId,
        ADMIN_ID,
        input
      );
      setMessages((p) => [
        ...p,
        { senderId: userId, receiverId: ADMIN_ID, message: input },
      ]);
      setInput("");
    } catch (err) {
      console.error("SendMessage error:", err);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-gray-800">Chat with Admin</h2>
      <div className="h-64 bg-gray-100 p-2 overflow-y-auto mb-4 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`px-3 py-2 rounded ${
                m.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border p-2 rounded-l bg-white text-gray-800"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default UserChatBox;
