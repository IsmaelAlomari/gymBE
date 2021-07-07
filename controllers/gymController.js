const { GymUsers, User, Gym, Class } = require('../db/models');
exports.createGym = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.img = `http://${req.get('host')}/media/${req.file.filename}`;
    }
    if (req.user.type !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      const createdGym = await Gym.create(req.body);
      const owner = req.owner;
      await GymUsers.create({
        gymId: createdGym.id,
        userId: owner.id,
      });
      await User.update(
        { type: 'owner' },
        {
          where: { id: owner.id },
        }
      );
      res.status(201).json(createdGym);
    }
  } catch (error) {
    next(error);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.img = `http://${req.get('host')}/media/${req.file.filename}`;
    }

    if (req.user.type === 'member') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      const foundedGym = await GymUsers.findOne({
        where: { gymId: req.gym.id },
      });
      console.log(foundedGym.userId, req.user.id);
      if (foundedGym.userId !== req.user.id || req.user.type !== 'admin') {
        res.status(401).json({ message: 'Unauthorized' });
      }
      req.body.gymId = req.gym.id;
      const createdClass = await Class.create(req.body);
      res.status(201).json(createdClass);
    }
  } catch (error) {
    next(error);
  }
};
exports.createCoach = async (req, res, next) => {
  try {
    if (req.user.type === 'member') {
      res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.type === 'owner') {
      const foundedGym = await GymUsers.findOne({
        where: {
          userId: req.user.id,
        },
      });
      if (foundedGym.gymId !== req.gym.id) {
        res.status(401).json({ message: 'Unauthorized' });
      }
      console.log('here');
      const user = await User.findByPk(req.member.id);
      user.update({
        type: 'coach',
      });
      await GymUsers.create({
        gymId: req.gym.id,
        userId: req.member.id,
      });
      res.status(201).json({ message: 'user is now a coach' });
    }
  } catch (error) {
    next(error);
  }
};
exports.removeCoach = async (req, res, next) => {
  try {
    if (req.user.type === 'member') {
      res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.type === 'owner') {
      const foundedGym = await GymUsers.findOne({
        where: {
          userId: req.user.id,
        },
      });
      if (foundedGym.gymId !== req.gym.id) {
        res.status(401).json({ message: 'Unauthorized' });
      }
      console.log('here');
      const user = await User.findByPk(req.member.id);
      user.update({
        type: 'member',
      });
      await GymUsers.destroy({
        where: { userId: req.member.id },
      });
      res.status(201).json({ message: 'user is now a member' });
    }
  } catch (error) {
    next(error);
  }
};
