const db = require('../models');

const createBag = async (req, res) => {
    try {
        const { name_bag, amount } = req.body;
        const newBag = await db.Bag.create({
            name_bag,
            amount,
            type_bag: "PIGGY BANK"
        });

        res.status(201).send(newBag);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

module.exports = {
    createBag
}