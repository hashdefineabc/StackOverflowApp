import { useState, useEffect, useCallback, useContext } from "react";
import Form from "../../../main/baseComponents/form";
import Input from "../../../main/baseComponents/input";
import PasswordInput from "../../../main/baseComponents/passwordInput";
import axios from "axios";
import { UserContext } from "../../../../UserContext";

import "./index.css";

const Register = ({ handleQuestions }) => {

  const {user, setUser} = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [csrfToken, setCsrfToken] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showUserExistsPopup, setShowUserExistsPopup] = useState(false);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/csrf-token", {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/check-login", {
        headers: {
          "x-csrf-token": csrfToken,
        },
        withCredentials: true,
      });
      const resLoggedIn = response.data.loggedIn;
      //setLoggedIn(resLoggedIn);
      if (resLoggedIn) setUser(response.data.user);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkLoginStatus();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkLoginStatus]);

  const handleRegister = async () => {
    let isValid = true;
    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    } 
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

    // Make sure to include the CSRF token in the headers
    try {
      const response = await axios.post("http://localhost:8000/auth/register",
        { email, password, username },
        {
          headers: {
            "x-csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        console.log(response.data);
        handleQuestions();
        setShowSuccessPopup(true); // Show success pop-up
      } else {
        setShowUserExistsPopup(true); // Show user exists pop-up
      }

    } catch (error) {
      setRegistrationMessage(error.message);
      setShowUserExistsPopup(true);
      console.error("Error registering:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", null, {
        headers: {
          "x-csrf-token": csrfToken,
        },
        withCredentials: true,
      });

      //setLoggedIn(false);
      setUser(null);
      setCsrfToken("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
      {user ? (
            <div>
              <p>Welcome, {user.username}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
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
                handleRegister();
              }}
            >
              Register
            </button>
            
          </div>
        </Form>
          )}
      </div>
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="popup-text">Signup Successful!</span>
            <button className="popup-close" onClick={() => setShowSuccessPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showUserExistsPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="popup-text">User already exists. Please try with a different email or username.</span>
            <button className="popup-close" onClick={() => setShowUserExistsPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
