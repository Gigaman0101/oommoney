const db = require('../models');
const { Op } = require('sequelize')

const createGrowBag = async (req, res) => {
    try {
        const { name_bag, amount } = req.body;
        const newBag = await db.Bag.create({
            name_bag,
            amount,
            type_bag: "GROW BAG",
            user_id: req.user.id
        });

        res.status(201).send(newBag);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const createFunBag = async (req, res) => {
    try {
        const { name_bag, amount } = req.body;
        const newBag = await db.Bag.create({
            name_bag,
            amount,
            type_bag: "FUN BAG",
            user_id: req.user.id
        });

        res.status(201).send(newBag);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getMyGrowBag = async (req, res) => {
    try {
        const targetBag = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "GROW BAG" }
                ]
            }
        });

        if (targetBag) {
            res.status(200).send(targetBag);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้สร้าง GROW BAG" })
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getMyMoneyBag = async (req, res) => {
    try {
        const targetBag = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "MONEY BAG" }
                ]
            }
        });

        if (targetBag) {
            res.status(200).send(targetBag);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้สร้าง MONEY BAG" })
        };

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getMyFunBag = async (req, res) => {
    try {
        const targetBag = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "FUN BAG" }
                ]
            }
        });

        if (targetBag) {
            res.status(200).send(targetBag);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้สร้าง FUN BAG" })
        };

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getAllBags = async (req, res) => {
    try {
        const allBags = await db.Bag.findAll({ where: { user_id: req.user.id } });

        res.status(200).send(allBags);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

module.exports = {
    createGrowBag,
    createFunBag,
    getMyGrowBag,
    getMyMoneyBag,
    getMyFunBag,
    getAllBags
}