const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,removeFromGroup
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);//check 36:00-postman
router.route("/rename").put(protect,renameGroup)//check 36:23(No.10) -postman
router.route("/groupadd").put(protect,addToGroup)// 41:37
router.route("/groupremove").put(protect,removeFromGroup)//check 41:37-postman

module.exports = router;
