module.exports = (sequelize, DataTypes) => {
    const Transfer = sequelize.define("Transfer", {
        amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type_transfer: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "transfers"
    })

    Transfer.associate = models => {
        Transfer.belongsTo(models.User, { foreignKey: "transfer_by" })
        Transfer.belongsTo(models.User, { foreignKey: "transfer_to" })
    }

    return Transfer;
}