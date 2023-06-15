import React from "react";

const Popup = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <button
          className="btn-close hover:bg-pink-500 hover:border-pink-500"
          onClick={props.handleClose}
        >
          x
        </button>
        {props.content}
      </div>
    </div>
  );
}

export default Popup