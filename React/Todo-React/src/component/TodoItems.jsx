import React from "react";
import AddItem from "./AddItem";
function TodoItems({ todoItems, onDeleteClick }) {
  return (
    <>
      {todoItems.map((item) => (
        <AddItem
          key={item}
          todoName={item.name}
          todoDate={item.dueDate}
          onDeleteClick={onDeleteClick}
        ></AddItem>
      ))}
    </>
  );
}

export default TodoItems;
