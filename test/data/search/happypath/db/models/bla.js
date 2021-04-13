module.exports = (sequelize, DataTypes) => {
  const bla = sequelize.define("bla", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {});
  bla.associate = function(models) {
    // associations can be defined here
    // bla.belongsTo(models.....)
  };
  return bla;
};
