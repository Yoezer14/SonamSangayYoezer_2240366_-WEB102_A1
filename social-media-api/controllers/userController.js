const {
  users,
  sanitizeUser,
  nextUserId,
} = require('../utils/mockData');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  return { page, limit };
}

/** Public fields for user listings (matches practical example). */
function userListItem(u) {
  return {
    id: u.id,
    username: u.username,
    full_name: u.full_name,
    profile_picture: u.profile_picture,
    bio: u.bio,
    created_at: u.created_at,
  };
}

exports.getUsers = (req, res) => {
  const { page, limit } = parsePagination(req);
  const total = users.length;
  const total_pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const slice = users.slice(start, start + limit).map(userListItem);

  return res.sendPayload({
    success: true,
    count: total,
    page,
    total_pages,
    data: slice,
  });
};

exports.getUser = (req, res, next) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }
  return res.sendPayload({ success: true, data: sanitizeUser(user) });
};

exports.createUser = (req, res, next) => {
  const { username, email, password, full_name, bio } = req.body;
  if (!username || !email || !password) {
    const err = new Error('username, email, and password are required');
    err.statusCode = 400;
    return next(err);
  }
  if (users.some((u) => u.username === username)) {
    const err = new Error('Username already taken');
    err.statusCode = 409;
    return next(err);
  }

  const today = new Date().toISOString().slice(0, 10);
  const newUser = {
    id: nextUserId(),
    username,
    email,
    password,
    full_name: full_name || '',
    profile_picture: req.body.profile_picture || '',
    bio: bio || '',
    created_at: today,
  };
  users.push(newUser);

  return res.sendPayload(
    {
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        created_at: newUser.created_at,
      },
    },
    201
  );
};

exports.updateUser = (req, res, next) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }

  const { username, email, full_name, bio, profile_picture, password } = req.body;
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (full_name !== undefined) user.full_name = full_name;
  if (bio !== undefined) user.bio = bio;
  if (profile_picture !== undefined) user.profile_picture = profile_picture;
  if (password !== undefined) user.password = password;

  return res.sendPayload({ success: true, data: sanitizeUser(user) });
};

exports.deleteUser = (req, res, next) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    const err = new Error('User not found');
    err.statusCode = 404;
    return next(err);
  }
  users.splice(idx, 1);
  return res.sendPayload({ success: true, data: {} }, 200);
};
