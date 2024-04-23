// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import { useState, React } from "react";import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import {UserContext} from "./UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState("");
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <FakeStackOverflow />
      <ToastContainer />
    </UserContext.Provider>
  );
}

export default App;
