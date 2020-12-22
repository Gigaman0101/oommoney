const db = require('../models');

const createCondition = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } })
        if (targetUser) {
            const { condition_name, condition_amount } = req.body;
            const newCondition = await db.ConditionBag.create({
                condition_name,
                condition_amount,
                user_id: targetUser.id
            });

            res.status(201).send(newCondition)
        } else {
            res.status(400).send({ message: "ยังไม่ได้ล็อคอิน" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    };
};

const getAllCondition = async (req, res) => {
    try {
        const allCondition = await db.ConditionBag.findAll();

        res.status(200).send(allCondition);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const getAllConditionByUser = async (req, res) => {
    try {
        const allCondition = await db.ConditionBag.findAll({
            where: {
                user_id: req.user.id
            }
        });

        res.status(200).send(allCondition)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    };
};

module.exports = {
    createCondition,
    getAllCondition,
    getAllConditionByUser
};