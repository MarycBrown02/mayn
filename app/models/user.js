var bcrypt = require("bcrypt-nodejs");


module.exports = function (sequelize, Sequelize) {

    var User = sequelize.define("User", {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        firstName: { type: Sequelize.STRING, notEmpty: true },
        lastName: { type: Sequelize.STRING, notEmpty: true },
        email: { type: Sequelize.STRING, validate: { isEmail: true } },
        password: { type: Sequelize.STRING, allowNull: false, notEmpty: true },
        last_login: { type: Sequelize.DATE },
        status: { type: Sequelize.ENUM("active", "inactive"), defaultValue: "active" }

    },
        {
            classMethods: {
                validPassword: function(password, passwd, done, user) {
                    return done(null, user);
                    // bcrypt.compare(password, passwd, function (err, isMatch) {
                    //     if (err) console.log(err);
                    //     if (isMatch) {
                    //         return done(null, user);
                    //     } else {
                    //         return done(null, false);
                    //     }
                    // });
                }
            }
        },
        {
            dialect: 'mysql'
        }
    );

    User.associate = function (models) {
        // Associating User with Favorites
        // When a User is deleted, also delete any associated Favorites
        User.hasMany(models.Favorite, {
            onDelete: "cascade"
        });
    };

    User.beforeCreate(function (user, options) {
        var salt = bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            return salt;
        });
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            } else {
                console.log("HASH = " + hash);
                console.log("orig: " + user.password);
                user.password = hash;
                console.log("new: " + user.password);
            }
        });
    });

    return User;

}