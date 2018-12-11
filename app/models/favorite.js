module.exports = function (sequelize, Sequelize) {

    var Favorite = sequelize.define("Favorite", {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        recipeId: { type: Sequelize.STRING, notEmpty: true },
        name: { type: Sequelize.STRING, notEmpty: true },
        recipelink: { type: Sequelize.STRING, notEmpty: true},
        img: { type: Sequelize.STRING, allowNull: false }
        

    });

    Favorite.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Favorite.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };

    return Favorite;

}