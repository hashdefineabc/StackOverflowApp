import "./index.css";
import { useState, useContext } from "react";
import { UserContext } from "../../../UserContext";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { updateUserProfile } from "../../../services/userProfileService";


const UserProfilePage = () => {
  const { user, setUser } = useContext(UserContext);

  if(user){

  const [title, setTitle] = useState(user.title || "");
  const [aboutme, setAboutme] = useState(user.aboutme || "");
  const [location, setLocation] = useState(user.location || "");
  const [githubLink, setGithubLink] = useState(user.githubLink || "");
  const [linkedInLink, setLinkedInLink] = useState(user.linkedInLink || "");

  const handleUpdateProfile = async () => {
    const userData = {
      title: title,
      aboutme: aboutme,
      location: location,
      githubLink: githubLink,
      linkedInLink: linkedInLink
    };

    try {
      const res = await updateUserProfile(user._id, userData);
      if (res && res._id) {
        setUser({ ...user, ...userData });
        toast.success("Profile Updated Successfully!");
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      <div className="user-info">
        <p>
          <span className="label">Username:</span> {user.username}
        </p>
        <p>
          <span className="label">Email:</span> {user.email}
        </p>
        <div>
          <span className="label">Title:</span>
          <Input val={title} setState={setTitle} mandatory={false} />
        </div>
        <div>
          <span className="label">About Me:</span>
          <Textarea val={aboutme} setState={setAboutme} mandatory={false} />
        </div>
        <div>
          <span className="label">Location:</span>
          <Input val={location} setState={setLocation} mandatory={false} />
        </div>
        <div>
          <span className="label">Github Link:</span>
          <Input val={githubLink} setState={setGithubLink} mandatory={false} />
        </div>
        <div>
          <span className="label">LinkedIn:</span>
          <Input val={linkedInLink} setState={setLinkedInLink} mandatory={false} />
        </div>
      </div>
      <button className="edit-profile-btn" onClick={handleUpdateProfile}>
        Update Profile
      </button>
    </div>
  );
  }
};

export default UserProfilePage;
