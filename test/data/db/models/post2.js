module.exports = (sequelize, DataTypes) => {
  const post2 = sequelize.define("post2", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    text: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    bla7: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  post2.associate = function (models) {
    // associations can be defined here
  };
  return post2;
};
