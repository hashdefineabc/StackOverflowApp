import { useContext, useState, useEffect } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";
import { validateHyperlink } from "../../../tool";
import { UserContext } from "../../../UserContext";
import { addQuestion, getQuestionById, updateQuestion } from "../../../services/questionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewQuestion = ({ handleQuestions, qid }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");
  const { user } = useContext(UserContext);
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (qid) {
        try {
          const res = await getQuestionById(qid);
          setQuestion(res || {});
        } catch (error) {
          console.error("Error fetching question:", error);
          toast.error("Failed to fetch the question. Please try again.");
        }
      }
    };
    fetchData();
  }, [qid]);

  useEffect(() => {
    if (qid && Object.keys(question).length > 0) {
      setTitle(question.title);
      setText(question.text);
      const tagsString = question.tags.map((tag) => tag.name).join(" ");
      setTag(tagsString);
    }
  }, [qid, question]);

  const validateForm = () => {
    let isValid = true;

    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least 1 tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      isValid = false;
    }

    for (let tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handlePostQuestion = async () => {
    if (!user) {
      toast.warning("Login to post your question!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const questionData = {
      title: title,
      text: text,
      tags: tag.split(" ").filter((tag) => tag.trim() !== ""),
      asked_by: user.username,
      ask_date_time: new Date(),
    };

    try {
      const res = await addQuestion(questionData);
      if (res && res._id) {
        handleQuestions();
        toast.success("Posted your question Successfully!");
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post the question. Please try again.");
    }
  };

  const handleEditQuestion = async () => {
    if (!validateForm()) {
      return;
    }

    const questionData = {
      title: title,
      text: text,
      tags: tag.split(" ").filter((tag) => tag.trim() !== ""),
      edit_date_time: new Date(),
    };

    try {
      const res = await updateQuestion(qid, questionData);
      if (res && res._id) {
        handleQuestions();
        toast.success("Question edited Successfully!");
      } else {
        toast.error("Error editing question");
      }
    } catch (error) {
      console.error("Error editing question:", error);
      toast.error("Failed to edit the question. Please try again.");
    }
  };

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <div className="btn_indicator_container">
        {qid ? (
          <button className="form_postBtn" onClick={handleEditQuestion}>
            Edit Question
          </button>
        ) : (
          <button className="form_postBtn" onClick={handlePostQuestion}>
            Post Question
          </button>
        )}
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestion;
