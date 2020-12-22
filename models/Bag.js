module.exports = (sequelize, DataTypes) => {
    const Bag = sequelize.define("Bag", {
        name_bag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: "0"
        },
        type_bag: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "bags"
    });

    Bag.associate = models => {
        Bag.belongsTo(models.User, { foreignKey: "user_id" });
        Bag.hasMany(models.Has, { foreignKey: "bag_id" });
        Bag.hasMany(models.Transfer, { foreignKey: "bag_by" });
        Bag.hasMany(models.Transfer, { foreignKey: "bag_to" });
    };

    return Bag
};