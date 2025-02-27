import "./index.css";
import { useState, useContext } from "react";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addAnswer } from "../../../services/answerService";
import { UserContext } from "../../../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewAnswer = ({ qid, handleAnswer }) => {
  const [text, setText] = useState("");
  const [textErr, setTextErr] = useState("");
  const { user } = useContext(UserContext);

  const toastLoginToPost = () => {
    toast.warning("Login to give your answer!");
  };
  const toastAnsweredSuccess = () => {
    toast.success("Posted your answer Successfully!");
  };
  const toastAnsweredFail = () => {
    toast.error("Posted your answer UnSuccessfully!");
  };

  const postAnswer = async () => {
    if (!user) {
      toastLoginToPost();
      return;
    }
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_by: user.username,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
      toastAnsweredSuccess();
    } else {
      toastAnsweredFail();
    }
  };
  return (
    <Form>
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
