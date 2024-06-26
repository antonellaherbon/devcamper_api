const express = require('express')

const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

const User = require('../modals/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); //everything below will use it
router.use(authorize('admin'));

router.route('/')
.get(advancedResults(User), getUsers)
.post(createUser)



router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports = router;