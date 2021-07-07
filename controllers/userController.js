const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { JWT_SECRET, JWT_EXPIRATION_MS } = require('../config/keys');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    req.body.password = await bcrypt.hashSync(req.body.password, saltRounds);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
exports.signin = (req, res, next) => {
  const token = generateToken(req.user);
  res.json({ token });
};
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + JWT_EXPIRATION_MS, // the token will expire after 15 minutes
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};
