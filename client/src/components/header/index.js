import "./index.css";
import { useState, useCallback, useEffect } from "react";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";
import { loginUserSuccess } from "../../actions/userActions";
import axios from "axios";

const Header = ({ search, setQuesitonPage }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [page, setPage] = useState("home");
  let content = null;
  const [val, setVal] = useState(search);
  const [loggedIn, setLoggedIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

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

  const handleQuestions = () => {
    setQuesitonPage();
    setPage("home");
  };

  const handleSignUp = () => {
    setPage("signup");
  };

  const handleLogin = () => {
    setPage("login");
  };

  const handleLogout = async () => {
    // Implement logout functionality here, such as clearing session data or tokens
    setLoggedIn(false);
    dispatch(setUser(null));
    try {
      await axios.post("http://localhost:8000/auth/logout", null, {
        headers: {
          "x-csrf-token": csrfToken,
        },
        withCredentials: true,
      });

      setLoggedIn(false);
      setUser("");
      setCsrfToken("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  switch (page) {
    // case "home": {
    //   content = setQuesitonPage();
    //   break;
    // }
    case "signup": {
      content = <SignUp handleQuestions={handleQuestions} />;
      break;
    }
    case "login": {
      content = <Login handleQuestions= {handleQuestions}/>;
      break;
    }
    default:
      //content = setQuesitonPage();
      break;
  }

  return (
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setQuesitonPage(e.target.value, "Search Results");
          }
        }}
      />

      <div>
        {loggedIn ? (
          <div>
            Welcome, {user.username}!
            <button onClick={handleLogout}> Logout</button>{" "}
          </div>
        ) : (
          <div>
            {content}
            <button onClick={handleSignUp}>Register</button>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
