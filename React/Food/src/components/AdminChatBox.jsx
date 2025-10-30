import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";

function AdminChatBox() {
  const token = localStorage.getItem("token");
  const [adminId, setAdminId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const connectionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setAdminId(decoded.userid);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, [token]);

  const fetchUsers = () => {
  //fetch("https://localhost:7076/api/chat/users")
    fetch("http://192.168.1.212/Backend/api/chat/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => !u.isAdmin)))
      .catch((err) => console.error(err));
  };

  const fetchUnreadCounts = () => {
    if (!adminId) return;
  // fetch(`https://localhost:7076/api/chat/unreadcount/${adminId}`)
     fetch(`http://192.168.1.212/Backend/api/chat/unreadcount/${adminId}`)
       .then((res) => res.json())
       .then((data) => {
         const counts = {};
         data.forEach((i) => (counts[i.userId] = i.count));
         setUnreadCounts(counts);
       });
  };

  const fetchChatHistory = (userId) => {
    if (!adminId || !userId) return;
  // fetch(`https://localhost:7076/api/chat/history/${adminId}/${userId}`)
     fetch(
       `http://192.168.1.212/Backend/api/chat/history/${adminId}/${userId}`
     )
       .then((res) => res.json())
       .then((data) => setMessages(data))
       .catch((err) => console.error(err));
  };

  const markAsRead = (userId) => {
    if (!adminId || !userId) return;
    //   fetch(`https://localhost:7076/api/chat/markread/${adminId}/${userId}`, {
    //     method: "POST",
    //   }).then(() => setUnreadCounts((prev) => ({ ...prev, [userId]: 0 })));
    // };
    fetch(
      `http://192.168.1.212/Backend/api/chat/markread/${adminId}/${userId}`,
      {
        method: "POST",
      }
    ).then(() => setUnreadCounts((prev) => ({ ...prev, [userId]: 0 })));
  };

  useEffect(() => {
    if (!adminId) return;

    fetchUsers();
    fetchUnreadCounts();

    const conn = new signalR.HubConnectionBuilder()
      // .withUrl(`https://localhost:7076/chatHub?userId=${adminId}`)
      .withUrl(`http://192.168.1.212/Backend/chatHub?userId=${adminId}`)
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => console.log("Admin connected"));

    conn.on("ReceiveMessage", (msg) => {
      if (
        msg.senderId === selectedUserId ||
        msg.receiverId === selectedUserId
      ) {
        setMessages((prev) => [...prev, msg]);
        markAsRead(selectedUserId);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    });

    connectionRef.current = conn;
    return () => conn.stop();
  }, [adminId, selectedUserId]);

  const selectUser = (id) => {
    setSelectedUserId(id);
    fetchChatHistory(id);
    markAsRead(id);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-6 border rounded-lg max-w-3xl mx-auto bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
        💬 Admin Chat Panel
      </h2>

      {/* User List */}
      <div className="mb-6 flex flex-wrap gap-2">
        {users.map((u) => (
          <div key={u.id} className="relative">
            <button
              onClick={() => selectUser(u.id.toString())}
              className={`px-3 py-1 rounded-lg border ${
                selectedUserId === u.id.toString()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {u.name}
            </button>
            {unreadCounts[u.id] > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCounts[u.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      {selectedUserId && (
        <>
          <div className="h-72 bg-gray-50 border rounded-lg p-3 overflow-y-auto mb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex mb-2 ${
                  m.senderId === adminId ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                    m.senderId === adminId
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  {m.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                connectionRef.current.invoke(
                  "SendMessage",
                  adminId,
                  selectedUserId,
                  input
                ) &&
                setInput("")
              }
              placeholder="Type a message..."
              className="flex-1 border rounded-l p-2 text-sm bg-white text-gray-800 outline-none"
            />
            <button
              onClick={() => {
                connectionRef.current.invoke(
                  "SendMessage",
                  adminId,
                  selectedUserId,
                  input
                );
                setInput("");
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700 transition-all"
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

