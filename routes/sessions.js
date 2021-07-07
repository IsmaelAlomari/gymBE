const express = require('express');
const passport = require('passport');
const upload = require('../middleware/multer');
const { User, Gym, Class, Session, SessionUsers } = require('../db/models');
const {
  fetchSession,
  getUserSessions,
  bookSession,
  deleteBookSession,
  deleteSession,
} = require('../controllers/sessionController');
const router = express.Router();
router.param('sessionId', async (req, res, next, sessionId) => {
  const session = await Session.findByPk(sessionId, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: User,
      attributes: ['id'],
      through: { attributes: [] },

      as: 'users',
    },
  });

  if (session) {
    req.session = session;
    next();
  } else {
    next({ message: 'session not found', status: 404 });
  }
});
router.get(
  '/usersessions',
  passport.authenticate('jwt', { session: false }),
  getUserSessions
);
router.delete(
  '/cancel/:sessionId',
  passport.authenticate('jwt', { session: false }),
  deleteSession
);

router.delete(
  '/:sessionId',
  passport.authenticate('jwt', { session: false }),
  deleteBookSession
);

router.post(
  '/:sessionId',
  passport.authenticate('jwt', { session: false }),
  bookSession
);

router.get(
  '/:sessionId',
  passport.authenticate('jwt', { session: false }),
  fetchSession
);

module.exports = router;
