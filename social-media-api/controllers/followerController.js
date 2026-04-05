const {
  followers,
  users,
  nextFollowerId,
} = require('../utils/mockData');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { page, limit };
}

exports.getFollowers = (req, res) => {
  let list = [...followers];
  const followerId = req.query.follower_id;
  const followingId = req.query.following_id;
  if (followerId !== undefined) {
    const fid = Number(followerId);
    list = list.filter((f) => f.follower_id === fid);
  }
  if (followingId !== undefined) {
    const tid = Number(followingId);
    list = list.filter((f) => f.following_id === tid);
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

exports.getFollower = (req, res, next) => {
  const id = Number(req.params.id);
  const row = followers.find((f) => f.id === id);
  if (!row) {
    const err = new Error('Follow relationship not found');
    err.statusCode = 404;
    return next(err);
  }
  return res.sendPayload({ success: true, data: row });
};

exports.createFollower = (req, res, next) => {
  const { follower_id, following_id } = req.body;
  const fid = Number(follower_id);
  const tid = Number(following_id);
  if (follower_id === undefined || following_id === undefined || Number.isNaN(fid) || Number.isNaN(tid)) {
    const err = new Error('follower_id and following_id are required');
    err.statusCode = 400;
    return next(err);
  }
  if (fid === tid) {
    const err = new Error('Cannot follow yourself');
    err.statusCode = 400;
    return next(err);
  }
  if (!users.some((u) => u.id === fid) || !users.some((u) => u.id === tid)) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }
  const exists = followers.some((f) => f.follower_id === fid && f.following_id === tid);
  if (exists) {
    const err = new Error('Follow relationship already exists');
    err.statusCode = 409;
    return next(err);
  }

  const today = new Date().toISOString().slice(0, 10);
  const newRow = {
    id: nextFollowerId(),
    follower_id: fid,
    following_id: tid,
    created_at: today,
  };
  followers.push(newRow);

  return res.sendPayload({ success: true, data: newRow }, 201);
};

exports.updateFollower = (req, res, next) => {
  const id = Number(req.params.id);
  const row = followers.find((f) => f.id === id);
  if (!row) {
    const err = new Error('Follow relationship not found');
    err.statusCode = 404;
    return next(err);
  }

  const { follower_id, following_id } = req.body;
  if (follower_id !== undefined) {
    const fid = Number(follower_id);
    if (!users.some((u) => u.id === fid)) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    row.follower_id = fid;
  }
  if (following_id !== undefined) {
    const tid = Number(following_id);
    if (!users.some((u) => u.id === tid)) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    row.following_id = tid;
  }
  if (row.follower_id === row.following_id) {
    const err = new Error('Cannot follow yourself');
    err.statusCode = 400;
    return next(err);
  }

  return res.sendPayload({ success: true, data: row });
};

exports.deleteFollower = (req, res, next) => {
  const id = Number(req.params.id);
  const idx = followers.findIndex((f) => f.id === id);
  if (idx === -1) {
    const err = new Error('Follow relationship not found');
    err.statusCode = 404;
    return next(err);
  }
  followers.splice(idx, 1);
  return res.sendPayload({ success: true, data: {} });
};
