const express = require('express');
const asyncHandler = require('../middleware/async');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', asyncHandler(commentController.getComments));
router.get('/:id', asyncHandler(commentController.getComment));
router.post('/', asyncHandler(commentController.createComment));
router.put('/:id', asyncHandler(commentController.updateComment));
router.delete('/:id', asyncHandler(commentController.deleteComment));

module.exports = router;
