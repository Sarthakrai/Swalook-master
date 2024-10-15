import React from "react";

const ConfirmationPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup">
      <p>Attendance marked successfully!</p>
      <div className="button-group">
        <button className="confirm-button" onClick={onConfirm}>
          Confirm
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
