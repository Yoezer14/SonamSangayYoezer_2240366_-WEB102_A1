const express = require('express');
const asyncHandler = require('../middleware/async');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', asyncHandler(postController.getPosts));
router.get('/:id', asyncHandler(postController.getPost));
router.post('/', asyncHandler(postController.createPost));
router.put('/:id', asyncHandler(postController.updatePost));
router.delete('/:id', asyncHandler(postController.deletePost));

module.exports = router;
