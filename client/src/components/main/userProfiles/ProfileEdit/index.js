// client/src/components/ProfileEdit.js

import React, { useState } from 'react';
import axios from 'axios';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/users/profile', formData);
      console.log(res.data); // Updated user profile data
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={username} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
