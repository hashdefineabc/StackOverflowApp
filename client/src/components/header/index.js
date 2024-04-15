import "./index.css";
import { useEffect, useState , useRef} from "react";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

const Header = ({ search, setQuesitonPage }) => {
    const [val, setVal] = useState(search);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signUpRef = useRef(null); // Ref for the signup modal

    useEffect(() => {
        // Function to handle clicks outside of the signup modal
        const handleClickOutside = (event) => {
            if (signUpRef.current && !signUpRef.current.contains(event.target)) {
                setShowSignUp(false); // Close the signup modal if clicked outside
            }
        };

        // Add event listener when the signup modal is open
        if (showSignUp) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Remove event listener when the signup modal is closed
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function to remove event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSignUp]); // Re-run effect when showSignUp state changes



    const handleSignUp = () => {
        setShowSignUp(true);
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

            {/* Conditionally render sign up modal */}
            {showSignUp && (
                <div ref={signUpRef}>
                    <SignUp handleSignUp={() => setShowSignUp(false)} setIsLoggedIn={setIsLoggedIn} onClose={handleCloseSignUp}/>
                </div>
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
