let userIdSeq = 4;
let postIdSeq = 4;
let commentIdSeq = 4;
let likeIdSeq = 4;
let followerIdSeq = 4;

const users = [
  {
    id: 1,
    username: 'traveler',
    email: 'traveler@example.com',
    password: 'hashed-placeholder',
    full_name: 'Karma',
    profile_picture: 'https://example.com/profiles/alex.jpg',
    bio: 'Travel photographer',
    created_at: '2023-01-15',
  },
  {
    id: 2,
    username: 'chef_mike',
    email: 'mike@example.com',
    password: 'hashed-placeholder',
    full_name: 'Mike Chen',
    profile_picture: 'https://example.com/profiles/mike.jpg',
    bio: 'Home cook',
    created_at: '2023-02-01',
  },
  {
    id: 3,
    username: 'runner_jane',
    email: 'jane@example.com',
    password: 'hashed-placeholder',
    full_name: 'Jane Doe',
    profile_picture: 'https://example.com/profiles/jane.jpg',
    bio: 'Marathon runner',
    created_at: '2023-02-10',
  },
];

const posts = [
  {
    id: 1,
    user_id: 1,
    caption: 'Sunset over the hills',
    image_url: 'https://example.com/images/sunset.jpg',
    created_at: '2023-03-01',
  },
  {
    id: 2,
    user_id: 2,
    caption: 'Tonight’s dinner',
    image_url: 'https://example.com/images/dinner.jpg',
    created_at: '2023-03-05',
  },
  {
    id: 3,
    user_id: 1,
    caption: 'New trail',
    image_url: 'https://example.com/images/trail.jpg',
    created_at: '2023-03-10',
  },
];

const comments = [
  {
    id: 1,
    post_id: 1,
    user_id: 2,
    text: 'Beautiful shot!',
    created_at: '2023-03-02',
  },
  {
    id: 2,
    post_id: 1,
    user_id: 3,
    text: 'Where is this?',
    created_at: '2023-03-02',
  },
  {
    id: 3,
    post_id: 2,
    user_id: 1,
    text: 'Looks delicious',
    created_at: '2023-03-06',
  },
];

const likes = [
  { id: 1, post_id: 1, user_id: 2, created_at: '2023-03-01' },
  { id: 2, post_id: 1, user_id: 3, created_at: '2023-03-02' },
  { id: 3, post_id: 2, user_id: 1, created_at: '2023-03-05' },
];

const followers = [
  { id: 1, follower_id: 2, following_id: 1, created_at: '2023-02-15' },
  { id: 2, follower_id: 3, following_id: 1, created_at: '2023-02-20' },
  { id: 3, follower_id: 1, following_id: 2, created_at: '2023-02-25' },
];

function sanitizeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

function nextUserId() {
  return userIdSeq++;
}

function nextPostId() {
  return postIdSeq++;
}

function nextCommentId() {
  return commentIdSeq++;
}

function nextLikeId() {
  return likeIdSeq++;
}

function nextFollowerId() {
  return followerIdSeq++;
}

module.exports = {
  users,
  posts,
  comments,
  likes,
  followers,
  sanitizeUser,
  nextUserId,
  nextPostId,
  nextCommentId,
  nextLikeId,
  nextFollowerId,
};
