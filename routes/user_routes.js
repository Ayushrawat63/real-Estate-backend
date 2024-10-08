const express = require("express");
const {
  allUsers,
  uniqueUser,
  updateUser,
  deleteUser,
  savePost,
  profilePosts,
} = require("../controller/user_controller");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get('/all', allUsers);

router.get("/unique/:id", verifyToken, uniqueUser);

router.put("/update/:id",verifyToken, updateUser);

router.delete("/delete/:id",verifyToken, deleteUser);

router.post("/save",verifyToken, savePost);

router.get('/profilePosts',verifyToken,profilePosts)

module.exports = router;
