const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Gym = sequelize.define('Gym', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
  SequelizeSlugify.slugifyModel(Gym, { source: ['name'] });
  Gym.associate = (models) => {
    Gym.belongsToMany(models.User, {
      through: models.GymUsers,
      as: 'users',
      foreignKey: 'gymId',
    });
    models.User.belongsToMany(Gym, {
      through: models.GymUsers,
      as: 'gyms',
      foreignKey: 'userId',
    });
  };
  Gym.associate = (models) => {
    Gym.hasMany(models.Class, { foreignKey: 'gymId', as: 'classes' });
    models.Class.belongsTo(Gym, { foreignKey: 'gymId' });
  };

  return Gym;
};
