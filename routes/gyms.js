const express = require('express');
const passport = require('passport');
const upload = require('../middleware/multer');
const { User, Gym } = require('../db/models');
const router = express.Router();

const {
  createGym,
  createClass,
  createCoach,
  removeCoach,
} = require('../controllers/gymController');
router.param('userId', async (req, res, next, userId) => {
  const owner = await User.findByPk(userId);
  if (owner) {
    req.owner = owner;
    next();
  } else {
    next({ message: 'user not found', status: 404 });
  }
});
router.param('gymId', async (req, res, next, gymId) => {
  const gym = await Gym.findByPk(gymId);
  if (gym) {
    req.gym = gym;
    next();
  } else {
    next({ message: 'gym not found', status: 404 });
  }
});
router.param('memberId', async (req, res, next, memberId) => {
  const member = await User.findByPk(memberId);
  if (member) {
    req.member = member;
    next();
  } else {
    next({ message: 'user not found', status: 404 });
  }
});

router.post(
  '/:userId/creategym',
  passport.authenticate('jwt', { session: false }),
  upload.single('img'),

  createGym
);
router.post(
  '/:gymId/createclass',
  passport.authenticate('jwt', { session: false }),
  upload.single('img'),
  createClass
);
router.post(
  '/:gymId/:memberId/createcoach',
  passport.authenticate('jwt', { session: false }),
  createCoach
);
router.post(
  '/:gymId/:memberId/removecoach',
  passport.authenticate('jwt', { session: false }),
  removeCoach
);

module.exports = router;
