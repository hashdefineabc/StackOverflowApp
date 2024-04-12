import { useState } from "react";
import Form from "../../../main/baseComponents/form";
import Input from "../../../main/baseComponents/input";
import PasswordInput from "../../../main/baseComponents/passwordInput";
import "./index.css";

import { addNewUser } from "../../../../services/userAuthService";

const SignUp = ({ handleSignUp, setIsLoggedIn, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");

  const postNewUser = async () => {
    let isValid = true;
    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } // add more email
    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    }
    if (!username) {
      setUsernameErr("Username cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    const newuser = {
      email: email,
      password: password,
      username: username,
    };

    const res = await addNewUser(newuser);
    if (res) {
      handleSignUp();
      setIsLoggedIn(true);
      onClose();
    } else {
      setRegistrationMessage(res.message);
      setEmail("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <Form>
          <Input
            title={"Username "}
            id={"formUsernameInput"}
            hint="Username"
            val={username}
            setState={setUsername}
            err={usernameErr}
          />
          <Input
            title={"Email "}
            hint={"example@gmail.com"}
            id={"formEmailInput"}
            val={email}
            setState={setEmail}
            err={emailErr}
          />
          <PasswordInput
            title={"Password "}
            id={"formPasswordInput"}
            hint="password"
            val={password}
            setState={setPassword}
            err={passwordErr}
          />

          {registrationMessage && (
            <div className="input_error">{registrationMessage}</div>
          )}
          <div className="mandatory_indicator">
            * indicates mandatory fields
          </div>
          <div className="btn_indicator_container">
            <button
              className="form_postBtn"
              onClick={() => {
                postNewUser();
              }}
            >
              Register
            </button>
            {/* Add link to login screen */}
            {/* <div className="login_link">
              Already have an account? <span onClick={handleLogin}>Login</span>
            </div> */}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
