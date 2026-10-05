// auth.js - Module Authentication
const users = [];

/**
 * Đăng ký tài khoản người dùng mới
 * @param {string} username 
 * @param {string} password 
 * @returns {object} Thông tin người dùng tạo thành công
 */
function register(username, password) {
  if (!username || !password) {
    throw new Error('Username và password không được để trống');
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    throw new Error('Người dùng đã tồn tại');
  }

  const newUser = {
    id: users.length + 1,
    username: username.trim(),
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  return { id: newUser.id, username: newUser.username };
}

/**
 * Đăng nhập hệ thống
 * @param {string} username 
 * @param {string} password 
 * @returns {object|null}
 */
function login(username, password) {
  const user = users.find(u => u.username === username && u.password === hashPassword(password));
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    token: generateToken(user)
  };
}

// Các hàm tiện ích (Utility functions)
function hashPassword(password) {
  // Giả lập hash mật khẩu
  return Buffer.from(password).toString('base64');
}

function generateToken(user) {
  // Giả lập tạo JWT token
  return `mock_token_${user.id}_${Date.now()}`;
}

module.exports = {
  register,
  login,
  hashPassword,
  generateToken
};
