import "./index.css";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import UserProfilePage from "./userProfilePage";

const Main = ({ search = "", title, setQuesitonPage }) => {
    //const navigate = useNavigate();
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    let selected = "";
    let content = null;


    const handleQuestions = () => {
        setQuesitonPage();
        setPage("home");
    };

    const handleTags = () => {
        setPage("tag");
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const clickTag = (tname) => {
        setQuesitonPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        setPage("newQuestion");
        
    };

    const handleNewAnswer = () => {
        setPage("newAnswer");
    };

    const handleEditQuestion = (qid) => {
        setQid(qid);
        setPage("editQuestion");
    };

    const handleUserProfile = () => {
        setPage("userProfile");
    };

    const getQuestionPage = (order = "newest", search = "") => {
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleNewQuestion={handleNewQuestion}
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(questionOrder.toLowerCase(), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    handleEditQuestion={handleEditQuestion}
                />
            );
            break;
        }
        case "newQuestion": {
            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions} />;
            break;
        }
        case "editQuestion": {
            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions} qid={qid} />;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = <NewAnswer qid={qid} handleAnswer={handleAnswer} />;
            break;
        }
        case "userProfile" : {
            selected = "u";
            content = <UserProfilePage />
            break;
        }
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleUserProfile={handleUserProfile}
            />
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );
};

export default Main;
