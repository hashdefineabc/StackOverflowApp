import { REACT_APP_API_URL, api } from "./config";

const PROFILE_API_URL = `${REACT_APP_API_URL}/profile`;

// To update User Profile
const updateUserProfile = async (uid, userData) => {
    const res = await api.put(`${PROFILE_API_URL}/${uid}/updateUserProfile`, userData);

    return res.data;
};

export {updateUserProfile};