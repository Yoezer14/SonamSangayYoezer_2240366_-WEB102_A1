const express = require('express');
const asyncHandler = require('../middleware/async');
const likeController = require('../controllers/likeController');

const router = express.Router();

router.get('/', asyncHandler(likeController.getLikes));
router.get('/:id', asyncHandler(likeController.getLike));
router.post('/', asyncHandler(likeController.createLike));
router.put('/:id', asyncHandler(likeController.updateLike));
router.delete('/:id', asyncHandler(likeController.deleteLike));

module.exports = router;
