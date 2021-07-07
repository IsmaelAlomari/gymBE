const Session = require('./Session');
const User = require('./User');

module.exports = (sequelize, DataTypes) => {
  const SessionUsers = sequelize.define('SessionUsers', {
    sessionId: {
      type: DataTypes.INTEGER,
      references: {
        model: Session,
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
  });
  return SessionUsers;
};
