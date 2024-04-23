import { useState, useCallback, useEffect, useContext } from "react";
import Form from "../../../main/baseComponents/form";
import Input from "../../../main/baseComponents/input";
import PasswordInput from "../../../main/baseComponents/passwordInput";
import axios from "axios";
import { UserContext } from "../../../../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ handleQuestions }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [csrfToken, setCsrfToken] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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
      setLoggedIn(resLoggedIn);
      setUser(response.data.user);
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

  const notifyLoginSuccess = () => {
    toast.success("Welcome back! \n ");
  };

  const notifyLoginFail = () => {
    toast.error("Please check email and password!");
  };

  const handleLogin = async () => {
    let isValid = true;
    setEmailErr("");
    setPasswordErr("");
    if (!email) {
      setEmailErr("Email cannot be empty");
      isValid = false;
    }
    if (!password) {
      setPasswordErr("Password cannot be empty");
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    // Make sure to include the CSRF token in the headers
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        {
          headers: {
            "x-csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setLoggedIn(true);
        setUser(response.data.user);
        console.log(user);
        handleQuestions();
        notifyLoginSuccess();
      } else {
        setShowPopup(true);
        notifyLoginFail();
      }
    } catch (error) {
      setRegistrationMessage(error.message);
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div>
          {loggedIn ? (
            { handleQuestions }
          ) : (
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
                    handleLogin();
                  }}
                >
                  {" "}
                  Login{" "}
                </button>
              </div>
            </Form>
          )}
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <span className="popup-text">Incorrect email or password.</span>
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
