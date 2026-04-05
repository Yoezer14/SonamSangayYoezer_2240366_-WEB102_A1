const {
  comments,
  posts,
  users,
  nextCommentId,
} = require('../utils/mockData');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { page, limit };
}

function enrichComment(c) {
  const author = users.find((u) => u.id === c.user_id);
  return {
    ...c,
    author_username: author ? author.username : null,
  };
}

exports.getComments = (req, res) => {
  let list = [...comments];
  const postId = req.query.post_id;
  if (postId !== undefined) {
    const pid = Number(postId);
    list = list.filter((c) => c.post_id === pid);
  }

  const { page, limit } = parsePagination(req);
  const total = list.length;
  const total_pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit).map(enrichComment);

  return res.sendPayload({
    success: true,
    count: total,
    page,
    total_pages,
    data,
  });
};

exports.getComment = (req, res, next) => {
  const id = Number(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    return next(err);
  }
  return res.sendPayload({ success: true, data: enrichComment(comment) });
};

exports.createComment = (req, res, next) => {
  const { post_id, user_id, text } = req.body;
  const pid = Number(post_id);
  const uid = Number(user_id);
  if (!post_id || Number.isNaN(pid) || !user_id || Number.isNaN(uid) || !text) {
    const err = new Error('post_id, user_id, and text are required');
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

  const today = new Date().toISOString().slice(0, 10);
  const newComment = {
    id: nextCommentId(),
    post_id: pid,
    user_id: uid,
    text,
    created_at: today,
  };
  comments.push(newComment);

  return res.sendPayload({ success: true, data: enrichComment(newComment) }, 201);
};

exports.updateComment = (req, res, next) => {
  const id = Number(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    return next(err);
  }

  const { text, post_id, user_id } = req.body;
  if (text !== undefined) comment.text = text;
  if (post_id !== undefined) {
    const pid = Number(post_id);
    if (!posts.some((p) => p.id === pid)) {
      const err = new Error('Post not found');
      err.statusCode = 404;
      return next(err);
    }
    comment.post_id = pid;
  }
  if (user_id !== undefined) {
    const uid = Number(user_id);
    if (!users.some((u) => u.id === uid)) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    comment.user_id = uid;
  }

  return res.sendPayload({ success: true, data: enrichComment(comment) });
};

exports.deleteComment = (req, res, next) => {
  const id = Number(req.params.id);
  const idx = comments.findIndex((c) => c.id === id);
  if (idx === -1) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    return next(err);
  }
  comments.splice(idx, 1);
  return res.sendPayload({ success: true, data: {} });
};
