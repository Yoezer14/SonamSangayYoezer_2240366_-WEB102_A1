const {
  posts,
  users,
  nextPostId,
} = require('../utils/mockData');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { page, limit };
}

function enrichPost(post) {
  const author = users.find((u) => u.id === post.user_id);
  return {
    ...post,
    author_username: author ? author.username : null,
  };
}

exports.getPosts = (req, res) => {
  let list = [...posts];
  const userId = req.query.user_id;
  if (userId !== undefined) {
    const uid = Number(userId);
    list = list.filter((p) => p.user_id === uid);
  }

  const { page, limit } = parsePagination(req);
  const total = list.length;
  const total_pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit).map(enrichPost);

  return res.sendPayload({
    success: true,
    count: total,
    page,
    total_pages,
    data,
  });
};

exports.getPost = (req, res, next) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    return next(err);
  }
  return res.sendPayload({ success: true, data: enrichPost(post) });
};

exports.createPost = (req, res, next) => {
  const { user_id, caption, image_url } = req.body;
  const uid = Number(user_id);
  if (!user_id || Number.isNaN(uid)) {
    const err = new Error('user_id is required');
    err.statusCode = 400;
    return next(err);
  }
  if (!users.some((u) => u.id === uid)) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }

  const today = new Date().toISOString().slice(0, 10);
  const newPost = {
    id: nextPostId(),
    user_id: uid,
    caption: caption || '',
    image_url: image_url || '',
    created_at: today,
  };
  posts.push(newPost);

  return res.sendPayload({ success: true, data: enrichPost(newPost) }, 201);
};

exports.updatePost = (req, res, next) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    return next(err);
  }

  const { caption, image_url, user_id } = req.body;
  if (caption !== undefined) post.caption = caption;
  if (image_url !== undefined) post.image_url = image_url;
  if (user_id !== undefined) {
    const uid = Number(user_id);
    if (!users.some((u) => u.id === uid)) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    post.user_id = uid;
  }

  return res.sendPayload({ success: true, data: enrichPost(post) });
};

exports.deletePost = (req, res, next) => {
  const id = Number(req.params.id);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    return next(err);
  }
  posts.splice(idx, 1);
  return res.sendPayload({ success: true, data: {} });
};
