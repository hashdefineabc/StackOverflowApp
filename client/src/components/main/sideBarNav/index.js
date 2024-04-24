import "./index.css";
import { useContext } from "react";
import { UserContext } from "../../../UserContext";

const SideBarNav = ({ selected = "", handleQuestions, handleTags, handleUserProfile }) => {
    const { user } = useContext(UserContext);

    return (
        <div id="sideBarNav" className="sideBarNav">
            <div
                id="menu_question"
                className={`menu_button ${
                    selected === "q" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleQuestions();
                }}
            >
                Questions
            </div>
            <div
                id="menu_tag"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleTags();
                }}
            >
                Tags
            </div>
            {user && (
                <div
                    id="menu_tag"
                    className={`menu_button ${
                        selected === "u" ? "menu_selected" : ""
                    }`}
                    onClick={() => {
                        handleUserProfile();
                    }}
                >
                    My Profile
                </div>
            )}
        </div>
    );
};

export default SideBarNav;
