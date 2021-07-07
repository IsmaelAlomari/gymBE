const { session } = require('passport');
const {
  GymUsers,
  User,
  Gym,
  Class,
  SessionUsers,
  Session,
} = require('../db/models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: 'smtp.gmail.com',
  auth: {
    user: 'spotsoft11@gmail.com',
    pass: '**',
  },
  secure: true,
});

exports.fetchSession = async (req, res, next) => {
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
      const foundedClass = await Class.findByPk(req.session.classId);
      if (foundedGym.gymId !== foundedClass.gymId) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    }
    if (req.user.type === 'caoch') {
      if (req.session.instructor != req.user.id) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    }

    res.status(200).json(req.session);
  } catch (error) {
    next(error);
  }
};

exports.getUserSessions = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const suser = await User.findByPk(+req.user.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Session,
        attributes: ['id'],
        through: { attributes: [] },
        as: 'sessions',
      },
    });

    res.status(200).json(suser);
  } catch (error) {
    next(error);
  }
};
exports.bookSession = async (req, res, next) => {
  try {
    await SessionUsers.create({
      userId: req.user.id,
      sessionId: req.session.id,
    });
    const mailData = {
      from: 'spotsoft11@gmail.com', // sender address
      to: req.user.email, // list of receivers
      subject: 'Welcome',
      text: `Name: ${req.session.name} Date: ${req.session.time}`,
      html: '<b>Hey there! </b>',
    };
    await transporter.sendMail(mailData, (error, info) => {});

    res.status(200).json('done');
  } catch (error) {
    next(error);
  }
};
exports.deleteBookSession = async (req, res, next) => {
  try {
    await SessionUsers.destroy({
      userId: req.user.id,
      sessionId: req.session.id,
    });

    res.status(200).json('done');
  } catch (error) {
    next(error);
  }
};
exports.deleteSession = async (req, res, next) => {
  try {
    const mailData = {
      from: 'spotsoft11@gmail.com', // sender address
      to: req.user.email, // list of receivers
      subject: 'Welcome',
      text: `Name: ${req.session.name} has been canceled`,
      html: '<b>Hey there! </b>',
    };
    await transporter.sendMail(mailData, (error, info) => {});

    await Session.destroy({
      where: { id: req.session.id },
    });

    res.status(200).json('done');
  } catch (error) {
    next(error);
  }
};
