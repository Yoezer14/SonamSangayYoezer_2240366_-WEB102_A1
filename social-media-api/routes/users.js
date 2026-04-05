const express = require('express');
const asyncHandler = require('../middleware/async');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', asyncHandler(userController.getUsers));
router.get('/:id', asyncHandler(userController.getUser));
router.post('/', asyncHandler(userController.createUser));
router.put('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

module.exports = router;
