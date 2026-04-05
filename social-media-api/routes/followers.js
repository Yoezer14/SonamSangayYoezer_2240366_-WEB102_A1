const express = require('express');
const asyncHandler = require('../middleware/async');
const followerController = require('../controllers/followerController');

const router = express.Router();

router.get('/', asyncHandler(followerController.getFollowers));
router.get('/:id', asyncHandler(followerController.getFollower));
router.post('/', asyncHandler(followerController.createFollower));
router.put('/:id', asyncHandler(followerController.updateFollower));
router.delete('/:id', asyncHandler(followerController.deleteFollower));

module.exports = router;
