import React from "react";

function AddItem({ todoName, todoDate, onDeleteClick }) {
  return (
    <div className="container text-center mt-4">
      <div className="row">
        <div className="col-6">{todoName}</div>

        <div className="col-4">{todoDate}</div>

        <div className="col-2 ">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDeleteClick(todoName)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
