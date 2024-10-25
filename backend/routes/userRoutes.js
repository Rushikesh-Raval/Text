const express = require('express');
const {registerUser, authUser, allUsers} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser); //used when u have to handle just a single request
router.route('/').get(protect ,allUsers)  //its in user controller
router.post('/login',authUser) //used when u have to deal with multiple requests

module.exports = router;