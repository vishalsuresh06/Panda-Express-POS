import React from "react";

function TextField({ label, value, onChange }) {
  return (
    <div>
      <label>
        {label}
        <input
          type="text"
          value={value} // Set the input value to the component's state
          onChange={(e) => onChange(e.target.value)} // Update the state on each keystroke
          style={styles.input}
        />
      </label>
    </div>
  );
}

export default TextField;
