import { useEffect, useState, useContext } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import { UserContext } from "../../../UserContext";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleEditQuestion }) => {
    const [question, setQuestion] = useState({});
    const [allowEditQuestion, setAllowEditQuestion] = useState(false);
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    useEffect(() => {
        if (user && user.username && question.asked_by === user.username) {
            setAllowEditQuestion(true);
        }
    }, [user, question]);

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
                handleEditQuestion={handleEditQuestion}
                qid = {qid}
                allowEdit={allowEditQuestion}
            />
            <QuestionBody
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
            />
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <Answer
                        key={idx}
                        text={a.text}
                        ansBy={a.ans_by}
                        meta={getMetaData(new Date(a.ans_date_time))}
                    />
                ))}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewAnswer();
                }}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage;
