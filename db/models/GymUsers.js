const Gym = require('./Session');
const User = require('./User');

module.exports = (sequelize, DataTypes) => {
  const GymUsers = sequelize.define('GymUsers', {
    gymId: {
      type: DataTypes.INTEGER,
      references: {
        model: Gym,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  return GymUsers;
};
