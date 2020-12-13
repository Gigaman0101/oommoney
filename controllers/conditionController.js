const db = require('../models');

const createCondition = async (req, res) => {
    try {
        const { condition_name } = req.body;
        const newCondition = await db.Condition.create({
            condition_name
        });

        res.status(201).send(newCondition)
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    };
};

const getAllCondition = async (req, res) => {
    try {
        const allCondition = await db.Condition.findAll();

        res.status(200).send(allCondition);
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

module.exports = {
    createCondition,
    getAllCondition
};