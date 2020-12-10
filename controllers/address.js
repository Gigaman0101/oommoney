const db = require('../models');

const createAddress = async (req, res) => {
    try {
        const { user_id, house_no, moo, floor, village, soi, road, province, district, sub_district, postal_code } = req.body;
        const targetUser = await db.User.findOne({ where: { id: user_id } });

        if (targetUser) {
            await db.Address.create({
                user_id: targetUser.id,
                house_no,
                moo,
                floor,
                village,
                soi,
                road,
                province,
                district,
                sub_district,
                postal_code
            });

            res.status(201).send({ message: `Address create at User name: ${targetUser.firstName}` })
        } else {
            res.status(400).send({ message: "user_id is incorrect" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

module.exports = {
    createAddress
}