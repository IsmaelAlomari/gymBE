const express = require('express');
const passport = require('passport');
const upload = require('../middleware/multer');
const { User, Gym, Class } = require('../db/models');
const {
  fetchClasses,
  createSession,
  fetchClass,
} = require('../controllers/classController');
const router = express.Router();

router.param('classId', async (req, res, next, classId) => {
  const foundedClass = await Class.findByPk(classId);
  if (foundedClass) {
    req.class = foundedClass;
    next();
  } else {
    next({ message: 'class not found', status: 404 });
  }
});
router.param('coachId', async (req, res, next, coachId) => {
  const coach = await User.findByPk(coachId);
  if (coach) {
    req.coach = coach;
    next();
  } else {
    next({ message: 'coach not found', status: 404 });
  }
});

router.get('/', fetchClasses);
router.get('/:classId', fetchClass);

router.post(
  '/:classId/:coachId/createSession',
  passport.authenticate('jwt', { session: false }),
  createSession
);

module.exports = router;
