const express = require('express');
const { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logOut } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logOut);
router.get('/me', protect, getMe);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resettoken', resetPassword);

module.exports = router;