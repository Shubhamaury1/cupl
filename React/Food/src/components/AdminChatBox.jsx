// import React, { useEffect, useState, useRef } from "react";
// import * as signalR from "@microsoft/signalr";

// function AdminChatBox() {
//   const ADMIN_ID = "55"; // Admin ID from DB
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const connectionRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Initialize SignalR connection
//   useEffect(() => {
//     const conn = new signalR.HubConnectionBuilder()
//       .withUrl(`https://localhost:7076/chatHub?userId=${ADMIN_ID}`)
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     conn
//       .start()
//       .then(() => console.log("✅ Admin connected to SignalR"))
//       .catch((err) => console.error("SignalR Connection Error:", err));

//     // Handle incoming messages
//     conn.on("ReceiveMessage", (msg) => {
//       if (
//         msg.senderId === selectedUserId ||
//         msg.receiverId === selectedUserId
//       ) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     connectionRef.current = conn;
//     return () => conn.stop();
//   }, [selectedUserId]);

//   // Fetch all users (excluding admin)
//   useEffect(() => {
//     setLoading(true);
//     fetch("https://localhost:7076/api/chat/users")
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data.filter((u) => !u.isAdmin));
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading users:", err);
//         setLoading(false);
//       });
//   }, []);

//   // Select user and load chat history
//   const handleSelectUser = (id) => {
//     setSelectedUserId(id);
//     setMessages([]);
//     setLoading(true);

//     fetch(`https://localhost:7076/api/chat/history/${ADMIN_ID}/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMessages(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching history:", err);
//         setLoading(false);
//       });
//   };

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send message
//   const sendMessage = async () => {
//     if (!input.trim() || !selectedUserId) return;
//     await connectionRef.current.invoke(
//       "SendMessage",
//       ADMIN_ID,
//       selectedUserId,
//       input
//     );
//     setInput("");
//   };

//   return (
//     <div className="p-6 border rounded-lg max-w-3xl mx-auto bg-white shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
//         💬 Admin Chat Panel
//       </h2>

//       {/* User Selection Section */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2 text-gray-700">Users</h3>
//         {loading && users.length === 0 ? (
//           <p className="text-gray-500 text-sm">Loading users...</p>
//         ) : users.length === 0 ? (
//           <p className="text-gray-500 text-sm">No users available</p>
//         ) : (
//           <div className="flex flex-wrap gap-2">
//             {users.map((u) => (
//               <button
//                 key={u.id}
//                 onClick={() => handleSelectUser(u.id.toString())}
//                 className={`px-3 py-1 rounded-lg border transition-all ${
//                   selectedUserId === u.id.toString()
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {u.name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Section */}
//       {selectedUserId ? (
//         <>
//           <div className="h-72 bg-gray-50 border rounded-lg p-3 overflow-y-auto mb-4">
//             {loading ? (
//               <p className="text-gray-500 text-center mt-20">Loading chat...</p>
//             ) : messages.length === 0 ? (
//               <p className="text-gray-500 text-center mt-20">
//                 No messages yet. Start chatting!
//               </p>
//             ) : (
//               messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`flex mb-2 ${
//                     m.senderId === ADMIN_ID ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <span
//                     className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
//                       m.senderId === ADMIN_ID
//                         ? "bg-blue-500 text-white rounded-br-none"
//                         : "bg-gray-300 text-black rounded-bl-none"
//                     }`}
//                   >
//                     {m.message}
//                   </span>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="flex items-center">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-l p-2 text-sm bg-white text-gray-800 outline-none"
              
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700 transition-all"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="text-gray-500 text-center py-10">
//           👆 Select a user to start chatting
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminChatBox;


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
    fetch("https://localhost:7076/api/chat/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => !u.isAdmin)))
      .catch((err) => console.error(err));
  };

  const fetchUnreadCounts = () => {
    if (!adminId) return;
    fetch(`https://localhost:7076/api/chat/unreadcount/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        const counts = {};
        data.forEach((i) => (counts[i.userId] = i.count));
        setUnreadCounts(counts);
      });
  };

  const fetchChatHistory = (userId) => {
    if (!adminId || !userId) return;
    fetch(`https://localhost:7076/api/chat/history/${adminId}/${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  };

  const markAsRead = (userId) => {
    if (!adminId || !userId) return;
    fetch(`https://localhost:7076/api/chat/markread/${adminId}/${userId}`, {
      method: "POST",
    }).then(() => setUnreadCounts((prev) => ({ ...prev, [userId]: 0 })));
  };

  useEffect(() => {
    if (!adminId) return;

    fetchUsers();
    fetchUnreadCounts();

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7076/chatHub?userId=${adminId}`)
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

