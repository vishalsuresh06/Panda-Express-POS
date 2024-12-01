import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../config.js";

import "./index.css";

function Login() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [employee, setEmployee] = useState("Vishal Suresh");
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (password.length !== 6) {
      setPasswordError("Password must be a 6-digit PIN");
      return;
    }

    setPasswordError("");
    navigate("/cashier", { state: { employee } });
  };

  return (
    <div className="lgn_mainContainer">
      <div className="lgn_topPart">
        <img
          className="lgn_pandaImg"
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express"
        />
      </div>

      <div className="lgn_loginCard">
        <div className="lgn_titleContainer">
          <h1 className="lgn_loginLabel">Login</h1>
        </div>
        <br></br>
        <div className="lgn_inputContainer">
          <input
            type="password"
            value={password}
            placeholder="Enter your 6-digit pin"
            onChange={(e) => setPassword(e.target.value)}
            className="inputBox"
            aria-label="Password"
          />
          {passwordError && (
            <label className="lgn_errorLabel">{passwordError}</label>
          )}
        </div>
        <br></br>
        <div className="lgn_inputContainer">
          <button className="lgn_inputButton" onClick={onButtonClick}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
