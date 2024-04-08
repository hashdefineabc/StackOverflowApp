import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import PasswordInput from "../baseComponents/passwordInput";
//import "./index.css";

import { addNewUser } from "../../../services/userAuthService";

const SignUp = ({ handleSignUp }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [usernameErr, setUsernameErr] = useState("");

    const postNewUser = async () => {
        let isValid = true;
        if(!email) {
            setEmailErr("Email cannot be empty");
            isValid = false;
        } // add more email 
        if(!password) {
            setPasswordErr("Password cannot be empty");
            isValid = false;
        }
        if(!username) {
            setUsernameErr("Username cannot be empty");
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        const newuser = {
            email: email,
            password: password,
            username: username
        };

        const res = await addNewUser(newuser);
        if (res && res._id) {
            handleSignUp();
        }
    }

    return (
        <Form>
            <Input
                title={"Username"}
                id={"formUsernameInput"}
                val={username}
                setState={setUsername}
                err={usernameErr}
            />
            <Input
                email={"Email"}
                hint={"example@gmail.com"}
                id={"formEmailInput"}
                val={email}
                setState={setEmail}
                err={emailErr}
            />
            <PasswordInput
                password={"Password"}
                id = {"formPasswordInput"}
                val = {password}
                setState = {setPassword}
                err = {passwordErr}
            />
            
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postNewUser();
                    }}
                >
                    Sign Up
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default SignUp;
