module.exports = function(sequelize, Sequelize) {

    var Meals = sequelize.define("Meals", {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        day1_b: { type: Sequelize.STRING, allowNull: true },
        day1_l: { type: Sequelize.STRING, allowNull: true },
        day1_d: { type: Sequelize.STRING, allowNull: true },
        day2_b: { type: Sequelize.STRING, allowNull: true },
        day2_l: { type: Sequelize.STRING, allowNull: true },
        day2__d: { type: Sequelize.STRING, allowNull: true },
        day3_b: { type: Sequelize.STRING, allowNull: true },
        day3_l: { type: Sequelize.STRING, allowNull: true },
        day3_d: { type: Sequelize.STRING, allowNull: true },
        day4_b: { type: Sequelize.STRING, allowNull: true },
        day4_l: { type: Sequelize.STRING, allowNull: true },
        day4_d: { type: Sequelize.STRING, allowNull: true },
        day5_b: { type: Sequelize.STRING, allowNull: true },
        day5_l: { type: Sequelize.STRING, allowNull: true },
        day5_d: { type: Sequelize.STRING, allowNull: true },
        day6_b: { type: Sequelize.STRING, allowNull: true },
        day6_l: { type: Sequelize.STRING, allowNull: true },
        day6_d: { type: Sequelize.STRING, allowNull: true },
        day7_b: { type: Sequelize.STRING, allowNull: true },
        day7_l: { type: Sequelize.STRING, allowNull: true },
        day7_d: { type: Sequelize.STRING, allowNull: true }
    }
    );

    Meals.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Meals.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };


   
    return Meals;

}