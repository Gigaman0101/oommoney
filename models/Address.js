module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        house_no: {
            type: DataTypes.STRING
        },
        moo: {
            type: DataTypes.STRING
        },
        floor: {
            type: DataTypes.STRING
        },
        village: {
            type: DataTypes.STRING
        },
        soi: {
            type: DataTypes.STRING
        },
        road: {
            type: DataTypes.STRING
        },
        province: {
            type: DataTypes.STRING
        },
        district: {
            type: DataTypes.STRING
        },
        sub_district: {
            type: DataTypes.STRING
        },
        postal_code: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "address"
    })

    Address.associate = models => {
        Address.belongsTo(models.User, { foreignKey: "user_id" })
    };

    return Address
};