const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
  SequelizeSlugify.slugifyModel(Class, { source: ['name'] });
  Class.associate = (models) => {
    Class.hasMany(models.Session, { foreignKey: 'classId', as: 'sessions' });
    models.Session.belongsTo(Class, { foreignKey: 'classId' });
  };

  return Class;
};
