import "./index.css";

// Header for the Answer page
const AnswerHeader = ({ ansCount, title, handleNewQuestion, handleEditQuestion, qid, allowEdit }) => {
    return (
        <div id="answersHeader" className="space_between right_padding">
            <div className="bold_title answer_count">{ansCount} answers</div>
            <div className="bold_title answer_question_title">{title}</div>
            {allowEdit && (
                <button className="editbtn" onClick={() => {handleEditQuestion(qid);}}>Edit Question</button>
            )}
            <button className="bluebtn" onClick={() => {handleNewQuestion();}}>Ask a Question</button>
        </div>
    );
};

export default AnswerHeader;
