const {
  likes,
  posts,
  users,
  nextLikeId,
} = require('../utils/mockData');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { page, limit };
}

exports.getLikes = (req, res) => {
  let list = [...likes];
  const postId = req.query.post_id;
  const userId = req.query.user_id;
  if (postId !== undefined) {
    const pid = Number(postId);
    list = list.filter((l) => l.post_id === pid);
  }
  if (userId !== undefined) {
    const uid = Number(userId);
    list = list.filter((l) => l.user_id === uid);
  }

  const { page, limit } = parsePagination(req);
  const total = list.length;
  const total_pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);

  return res.sendPayload({
    success: true,
    count: total,
    page,
    total_pages,
    data,
  });
};

exports.getLike = (req, res, next) => {
  const id = Number(req.params.id);
  const like = likes.find((l) => l.id === id);
  if (!like) {
    const err = new Error('Like not found');
    err.statusCode = 404;
    return next(err);
  }
  return res.sendPayload({ success: true, data: like });
};

exports.createLike = (req, res, next) => {
  const { post_id, user_id } = req.body;
  const pid = Number(post_id);
  const uid = Number(user_id);
  if (!post_id || Number.isNaN(pid) || !user_id || Number.isNaN(uid)) {
    const err = new Error('post_id and user_id are required');
    err.statusCode = 400;
    return next(err);
  }
  if (!posts.some((p) => p.id === pid)) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    return next(err);
  }
  if (!users.some((u) => u.id === uid)) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }
  const exists = likes.some((l) => l.post_id === pid && l.user_id === uid);
  if (exists) {
    const err = new Error('Like already exists for this post and user');
    err.statusCode = 409;
    return next(err);
  }

  const today = new Date().toISOString().slice(0, 10);
  const newLike = {
    id: nextLikeId(),
    post_id: pid,
    user_id: uid,
    created_at: today,
  };
  likes.push(newLike);

  return res.sendPayload({ success: true, data: newLike }, 201);
};

exports.updateLike = (req, res, next) => {
  const id = Number(req.params.id);
  const like = likes.find((l) => l.id === id);
  if (!like) {
    const err = new Error('Like not found');
    err.statusCode = 404;
    return next(err);
  }

  const { post_id, user_id } = req.body;
  if (post_id !== undefined) {
    const pid = Number(post_id);
    if (!posts.some((p) => p.id === pid)) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      return next(err);
    }
    like.post_id = pid;
  }
  if (user_id !== undefined) {
    const uid = Number(user_id);
    if (!users.some((u) => u.id === uid)) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    like.user_id = uid;
  }

  return res.sendPayload({ success: true, data: like });
};

exports.deleteLike = (req, res, next) => {
  const id = Number(req.params.id);
  const idx = likes.findIndex((l) => l.id === id);
  if (idx === -1) {
    const err = new Error('Like not found');
    err.statusCode = 404;
    return next(err);
  }
  likes.splice(idx, 1);
  return res.sendPayload({ success: true, data: {} });
};
