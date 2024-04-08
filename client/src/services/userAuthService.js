import { REACT_APP_API_URL, api } from "./config";

const USERAUTH_API_URL = `${REACT_APP_API_URL}/auth`;

// To add new user
const addNewUser = async (u) => {
    const res = await api.post(`${USERAUTH_API_URL}/signup`, u);

    return res.data;
};

export { addNewUser };
