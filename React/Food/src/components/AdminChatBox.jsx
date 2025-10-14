import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

function AdminChatBox() {
  const ADMIN_ID = "55"; // your admin id in DB
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const connectionRef = useRef(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7076/chatHub?userId=${ADMIN_ID}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => console.log("✅ Connected (Admin)"))
      .catch((err) => console.error("SignalR error:", err));

    conn.on("ReceiveMessage", (msg) => {
      if (
        msg.senderId === selectedUserId ||
        msg.receiverId === selectedUserId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    connectionRef.current = conn;
    return () => conn.stop();
  }, [selectedUserId]);

  useEffect(() => {
    fetch("https://localhost:7076/api/chat/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => !u.isAdmin)));
  }, []);

  const selectUser = (id) => {
    setSelectedUserId(id);
    fetch(`https://localhost:7076/api/chat/history/${ADMIN_ID}/${id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    await connectionRef.current.invoke(
      "SendMessage",
      ADMIN_ID,
      selectedUserId,
      input
    );
    setMessages((p) => [
      ...p,
      { senderId: ADMIN_ID, receiverId: selectedUserId, message: input },
    ]);
    setInput("");
  };

  return (
    <div className="p-4 border rounded max-w-xl mx-auto">
      <h2 className="text-xl mb-4">Admin Chat Panel</h2>
      <div className="mb-4 flex gap-2 flex-wrap">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => selectUser(u.id.toString())}
            className={`px-3 py-1 border rounded ${
              selectedUserId === u.id.toString() ? "bg-blue-500 text-white" : ""
            }`}
          >
            {u.name}
          </button>
        ))}
      </div>

      {selectedUserId && (
        <>
          <div className="h-64 bg-gray-100 p-2 mb-4 rounded overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  m.senderId === ADMIN_ID ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`px-3 py-2 rounded ${
                    m.senderId === ADMIN_ID
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
              className="flex-1 border p-2 rounded-l bg-white"
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminChatBox;
