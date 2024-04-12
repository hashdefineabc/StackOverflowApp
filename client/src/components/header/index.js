import "./index.css";
import { useState } from "react";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

const Header = ({ search, setQuesitonPage }) => {
    const [val, setVal] = useState(search);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignUp = () => {
        setShowSignUp("signup");
    }

    const handleCloseSignUp = () => {
        setShowSignUp(false);
    };

    const handleLogin = () => {
        setShowLogin("login");
    }

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const handleLogout = () => {
        // Implement logout functionality here, such as clearing session data or tokens
        setIsLoggedIn(false);
    };

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

            {/* Conditionally render sign up form */}
            {showSignUp && (
                <SignUp handleSignUp={handleCloseSignUp} setIsLoggedIn={setIsLoggedIn} onClose={handleCloseSignUp}/>
            )}
            {showLogin && (
                <Login handleLogin={handleCloseLogin} setIsLoggedIn={setIsLoggedIn} onClose={handleCloseLogin}/>
            )}
            {/* Conditional rendering for logout button */}
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <div>
                    <button onClick={handleSignUp}>Register</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}

        </div>
    );
};

export default Header;
