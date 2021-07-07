const {
  Class,
  Gym,
  Session,
  GymUsers,
  SessionUsers,
  User,
} = require('../db/models');

exports.fetchClasses = async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};
exports.fetchClass = async (req, res, next) => {
  try {
    const classes = await Class.findByPk(req.class.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Session,
        attributes: ['id', 'instructor'],
        as: 'sessions',
      },
    });

    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    if (req.user.type === 'member') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      if (req.user.type === 'owner') {
        const gym = await Gym.findByPk(req.class.gymId);
        const foundedGym = await GymUsers.findOne({
          where: { gymId: gym.id },
        });
        if (foundedGym.userId !== req.user.id) {
          res.status(401).json({ message: 'Unauthorized' });
        }
      }
      if (req.user.type === 'coach') {
        const gym = await Gym.findByPk(req.class.gymId);
        const foundedGym = await GymUsers.findOne({
          where: { userId: req.coach.id },
        });
        if (foundedGym.gymId !== gym.id) {
          res.status(401).json({ message: 'Unauthorized' });
        }
      }
      const gym = await Gym.findByPk(req.class.gymId);

      await GymUsers.create({
        gymId: gym.id,
        userId: req.coach.id,
      });

      req.body.classId = req.class.id;
      req.body.instructor = req.coach.id;

      const session = await Session.create(req.body);

      const sessionUsers = await SessionUsers.create({
        sessionId: session.id,
        userId: req.coach.id,
      });
      res.status(200).json(session);
    }
  } catch (error) {
    next(error);
  }
};
