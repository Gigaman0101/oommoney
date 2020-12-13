module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        
        status: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "notifications"
    });

    return Notification;
};