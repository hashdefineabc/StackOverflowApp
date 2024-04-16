import { useState, useCallback, useEffect } from "react";
import Form from "../../../main/baseComponents/form";
import Input from "../../../main/baseComponents/input";
import PasswordInput from "../../../main/baseComponents/passwordInput";
import axios from "axios";
import { loginUserSuccess } from '../../../../actions/userActions';
import { useDispatch } from 'react-redux';


const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  //const [user, setUser] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");

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
      dispatch(loginUserSuccess(response.data.user)); 
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

  const handleLogin = async () => {
    let isValid = true;
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

      setLoggedIn(response.data.success);
      console.log(response.data);
    } catch (error) {
      setRegistrationMessage(error.message);
      console.error("Error logging in:", error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await axios.post("http://localhost:8000/auth/logout", null, {
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //       },
  //       withCredentials: true,
  //     });

  //     setLoggedIn(false);
  //     setCsrfToken("");
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  return (
    <div className="modal">
      <div className="modal-content">
        <div>
          {loggedIn ? (
            <div>
              
              </div>
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
                {/* <div className="login_link">
                  Dont have an account?{" "}
                  <button onClick={() => {handleRegister();}}>Register</button>
                </div> */}
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
