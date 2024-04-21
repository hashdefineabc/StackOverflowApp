import { getMetaData } from "../../../../tool";
import { useState, useContext, useEffect } from "react";
import "./index.css";
import { UserContext } from "../../../../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  upvoteQuestion,
  downvoteQuestion,
} from "../../../../services/questionService";

const Question = ({ q, clickTag, handleAnswer }) => {
  const { user } = useContext(UserContext);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotesCount, setUpvotesCount] = useState(
    q.upvotes ? q.upvotes.length : 0
  );

  useEffect(() => {
    // Update upvotes count whenever q changes
    setUpvotesCount(q.upvotes ? q.upvotes.length : 0);

    // Set initial upvoted state based on user's upvote status
    if (user && q.upvotes) {
      q.upvotes.some(u => { 
        if(u == user._id) {
          setUpvoted(true);
        }
        console.log(upvoted);
      });
    }
  }, [q, user]);

  const handleUpvote = async () => {
    if (!user) {
      toast.warning("Login to vote!");
      return;
    }
    try {
      await upvoteQuestion(q._id, user);
      setUpvoted(true);
      setUpvotesCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error upvoting question:", error);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      toast.warning("Login again to downvote!");
      return;
    }
    try {
      await downvoteQuestion(q._id, user);
      setUpvoted(false);
      setUpvotesCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error downvoting question:", error);
    }
  };
  return (
    <div className="question right_padding">
      <div className="postStats">
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div className="question_mid">
        <div
          className="postTitle"
          onClick={() => {
            handleAnswer(q._id);
          }}
        >
          {q.title}
        </div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => {
            return (
              <button
                key={idx}
                className="question_tag_button"
                onClick={(e) => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="lastActivity">
        <div className="question_author">{q.asked_by}</div>
        <div>&nbsp;</div>
        <div className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </div>
      </div>
      <div className="upvote_section">
        {/* Display upvotes count */}
        <span>{upvotesCount}</span>
        {/* Toggle upvote/downvote button based on state */}
        {!user ? (
          <button onClick={handleUpvote}>Upvote</button>
        ) : !upvoted ? (
          <button onClick={handleUpvote}>Upvote</button>
        ) : (
          <button onClick={handleDownvote}>Downvote</button>
        )}
      </div>
    </div>
  );
};

export default Question;
