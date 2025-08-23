// import React from "react";
// import { useState } from "react";

// function AddTodo({ onNewItem }) {
//   const [todoName, setTodoName] = useState("");
//   const [dueDate, setDueDate] = useState("");

//   const handleNameChange = (event) => {
//     setTodoName(event.target.value);
//   };
//   const handleDateChange = (event) => {
//     setDueDate(event.target.value);
//   };

//   const handleAddButtonClick = () => {
//     onNewItem(todoName, dueDate);
//     setDueDate("");
//     setTodoName("");
//   };

//   return (
//     <div className="container text-center mt-4">
//       <div className="row">
//         <div className="col-6">
//           <input
//             type="text"
//             placeholder="Enter Todo Here"
//             value={todoName}
//             onChange={handleNameChange}
//           />
//         </div>

//         <div className="col-4">
//           <input type="date" value={dueDate} onChange={handleDateChange} />
//         </div>

//         <div className="col-2">
//           <button
//             type="button"
//             className="btn btn-success"
//             onClick={handleAddButtonClick}
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddTodo;

import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function AddTodo({ onNewItem }) {
  const [todoName, setTodoName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleNameChange = (event) => {
    setTodoName(event.target.value);
  };
  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  };
  // Add data in local storage
  useEffect(() => {
    const Sname = localStorage.getItem("TodoName");
    const Sdate = localStorage.getItem("DueDate");
    if (Sname) setTodoName(Sname);
    if (Sdate) setDueDate(Sdate);
  }, []);

  const handleAddButtonClick = () => {
   
    const Cname = localStorage.getItem("TodoName");
    const Cdate = localStorage.getItem("DueDate");

    if (todoName != Cname && dueDate != Cdate) {
       localStorage.setItem("TodoName", todoName);
       localStorage.setItem("DueDate", dueDate);
      alert(`Data Save In Local Storage`);
    } else {
      alert("Data Already Exit in Local Storage ");
    }
    onNewItem(todoName, dueDate);

    setDueDate("");
    setTodoName("");
  };

  return (
    <div className="container text-center mt-4">
      <div className="row">
        <div className="col-6">
          <input
            type="text"
            placeholder="Enter Todo Here"
            value={todoName}
            onChange={handleNameChange}
          />
        </div>

        <div className="col-4">
          <input type="date" value={dueDate} onChange={handleDateChange} />
        </div>

        <div className="col-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddButtonClick}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTodo;
