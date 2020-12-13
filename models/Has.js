module.exports = (sequelize, DataTypes) => {
    const Has = sequelize.define("Has", {
        status: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "has"
    });

    Has.associate = models => {
        Has.belongsTo(models.Bag, { foreignKey: "bag_id" });
        Has.belongsTo(models.Bag, { foreignKey: "condition_id" });
    };

    return Has;
};