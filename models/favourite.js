// Definicion del modelo Favourite:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favourite',
            { userId: {
                 type: DataTypes.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo user no puede estar vacio"}
                 }
              },
              postId: {
                 type: DataTypes.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo post no puede estar vacio"}
                 }
              }
            });
}
