import { useState } from "react";
import Form from "../../../main/baseComponents/form";
import Input from "../../../main/baseComponents/input";
import PasswordInput from "../../../main/baseComponents/passwordInput";

import { loginUser } from "../../../../services/userAuthService";

const Login = ({ handleLogin, setIsLoggedIn, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");

  const postLogin = async () => {
    let isValid = true;
    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } // add more email
    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    }screenLeft

    if (!isValid) {
      return;
    }
    const curuser = {
      email: email,
      password: password,
    };

    const res = await loginUser(curuser);
    if (res) {
      handleLogin();
      setIsLoggedIn(true);
      onClose();
    } else {
      setRegistrationMessage(res.message);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <Form>
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
                postLogin();
              }}
            >
              Login
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

export default Login;
