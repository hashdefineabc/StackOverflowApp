const express = require("express");
const User = require("../models/users");

const router = express.Router();

// To update profile
router.put('/:id/updateUserProfile', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUserData = req.body;

        // Update the profile detaile in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,

            { new: true } // Return the updated document
        );
        console.log(updatedUser);

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
