module.exports = (sequelize, DataTypes) => {
    const Bag = sequelize.define("Bag", {
        name_bag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.STRING,
        },
        type_bag: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "bags"
    });

    Bag.associate = models => {
        Bag.belongsTo(models.User, { foreignKey: "user_id" })
    };

    return Bag
};