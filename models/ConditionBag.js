module.exports = (sequelize, DataTypes) => {
    const Condition = sequelize.define("ConditionBag", {
        condition_name: {
            type: DataTypes.STRING
        },
        condition_amount: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "conditionBags"
    });

    Condition.associate = models => {
        Condition.hasMany(models.Has, { foreignKey: "condition_id" })
    };

    return Condition;
};