import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";

function UserChatBox() {
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);

    useEffect(() => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserId(decoded.userid);
          console.log("UserId is",decoded)
        } catch (err) {
          console.error("Invalid token:", err);
        }
      } else {
        console.warn("No token found in localStorage");
      }
    }, [token]);

  const ADMIN_ID = "55"; // your admin id from DB
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const connectionRef = useRef(null);
  const messagesEndRef = useRef(null);

  //SignalR connection
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7076/chatHub?userId=${userId}`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => {
        console.log("✅ Connected (User Chat)");

        // Load old chat history
        fetch(`https://localhost:7076/api/chat/history/${userId}/${ADMIN_ID}`)
          .then((res) => res.json())
          .then((data) => setMessages(data));
      })
      .catch((err) => console.error("SignalR connection error:", err));

    // Listen for incoming messages
    conn.on("ReceiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    connectionRef.current = conn;
    return () => conn.stop();
  }, [userId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await connectionRef.current.invoke(
        "SendMessage",
        userId,
        ADMIN_ID,
        input
      );
      setInput("");
    } catch (err) {
      console.error("SendMessage error:", err);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 z-50"
      >
        💬
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 bg-white border shadow-lg rounded-lg w-80 h-96 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t flex justify-between items-center">
            <span className="font-semibold">Customer Support</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✖
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  m.senderId === userId ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-sm ${
                    m.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {m.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-l p-2 text-sm outline-none bg-white text-gray-800"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded-r text-sm hover:bg-blue-700 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserChatBox;


// import React, { useState, useEffect, useRef } from "react";
// import * as signalR from "@microsoft/signalr";
// import { jwtDecode } from "jwt-decode";

// function UserChatBox() {
//   const token = localStorage.getItem("token");
//   const [userId, setUserId] = useState(null);
//   const [adminId, setAdminId] = useState("55"); // default admin
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [unreadCount, setUnreadCount] = useState(0);
//   const connectionRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Decode token
//   useEffect(() => {
//     if (!token) return;
//     try {
//       const decoded = jwtDecode(token);
//       setUserId(decoded.userid);
//       if (decoded.adminid) setAdminId(decoded.adminid);
//     } catch (err) {
//       console.error("Invalid token", err);
//     }
//   }, [token]);

//   // Fetch unread messages count from server
//   const fetchUnreadCount = () => {
//     if (!userId || !adminId) return;
//     fetch(`https://localhost:7076/api/chat/unreadcount/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const adminUnread = data.find((u) => u.userId === adminId);
//         setUnreadCount(adminUnread ? adminUnread.count : 0);
//       })
//       .catch((err) => console.error(err));
//   };

//   // Fetch chat history
//   const fetchChatHistory = () => {
//     if (!userId || !adminId) return;
//     fetch(`https://localhost:7076/api/chat/history/${userId}/${adminId}`)
//       .then((res) => res.json())
//       .then((data) => setMessages(data))
//       .catch((err) => console.error(err));
//   };

//   // Mark messages as read
//   const markAsRead = () => {
//     if (!userId || !adminId) return;
//     fetch(`https://localhost:7076/api/chat/markread/${userId}/${adminId}`, {
//       method: "POST",
//     })
//       .then(() => setUnreadCount(0))
//       .catch((err) => console.error(err));
//   };

//   // SignalR connection
//   useEffect(() => {
//     if (!userId || !adminId) return;

//     const conn = new signalR.HubConnectionBuilder()
//       .withUrl(`https://localhost:7076/chatHub?userId=${userId}`)
//       .withAutomaticReconnect()
//       .build();

//     conn.start().then(() => {
//       console.log("Connected to SignalR Hub");
//       fetchChatHistory();
//       fetchUnreadCount();
//     });

//     conn.on("ReceiveMessage", (msg) => {
//       if (msg.senderId === adminId) {
//         if (isOpen) {
//           setMessages((prev) => [...prev, msg]);
//           markAsRead();
//         } else {
//           setUnreadCount((prev) => prev + 1);
//         }
//       } else {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     connectionRef.current = conn;
//     return () => conn.stop();
//   }, [userId, adminId, isOpen]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     await connectionRef.current.invoke("SendMessage", userId, adminId, input);
//     setInput("");
//   };

//   const toggleChat = () => {
//     setIsOpen((prev) => !prev);
//     if (!isOpen) {
//       // when opening chat, fetch history and mark as read
//       fetchChatHistory();
//       markAsRead();
//     }
//   };

//   return (
//     <>
//       {/* Chat Icon */}
//       <div
//         onClick={toggleChat}
//         className="fixed bottom-5 left-4 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 z-50"
//       >
//         💬
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="fixed bottom-20 left-5 bg-white border shadow-lg rounded-lg w-80 h-96 flex flex-col z-50">
//           <div className="bg-blue-600 text-white p-3 rounded-t flex justify-between items-center">
//             <span className="font-semibold">Customer Support</span>
//             <button
//               onClick={toggleChat}
//               className="text-white hover:text-gray-200"
//             >
//               ✖
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
//             {messages.length === 0 ? (
//               <p className="text-gray-500 text-center mt-20">
//                 No messages yet.
//               </p>
//             ) : (
//               messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`mb-2 ${
//                     m.senderId === userId ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block px-3 py-2 rounded-lg text-sm ${
//                       m.senderId === userId
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-black"
//                     }`}
//                   >
//                     {m.message}
//                   </span>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-2 flex border-t">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//               className="flex-1 border rounded-l p-2 text-sm outline-none bg-white text-gray-800"
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-600 text-white px-3 rounded-r text-sm hover:bg-blue-700 transition-all"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default UserChatBox;


