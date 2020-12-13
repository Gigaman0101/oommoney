const db = require('../models');

const selectCondition = async (req, res) => {
    try {
        const { condition_id, bag_id } = req.body;
        const targetCondition = await db.Condition.findOne({
            where: {
                condition_id,
            }
        });

        if (targetCondition) {
            const targetBag = await db.Bag.findOne({ where: { bag_id } })
            const newSelect = await db.Has.create({
                bag_id: targetBag.id,
                condition_id: targetCondition.id,
                status: "DISABLE"
            });

            res.status(201).send(newSelect)
        } else {
            res.status(400).send({ message: "ไม่พบ condition นี้" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};

const activeCondition = async (req, res) => {
    try {
        const { id } = req.params;
        const targetSelect = await db.Has.findOne({
            where: { id },
            include: {
                model: db.Condition
            }
        })
        if (targetSelect) {
            await targetSelect.update({
                status: "ACTIVE"
            });

            res.status(200).send({ message: `เปิดใช้งานเงื่อนไข ${targetSelect.Condition.condition_name}` })
        } else {
            res.status(400).send({ message: "ไม่พบเงื่อนไขนี้ในกระเป๋า" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const disableCondition = async (req, res) => {
    try {
        const { id } = req.params;
        const targetSelect = await db.Has.findOne({
            where: { id },
            include: {
                model: db.Condition
            }
        })
        if (targetSelect) {
            await targetSelect.update({
                status: "DISABLE"
            });

            res.status(200).send({ message: `ปิด เงื่อนไข ${targetSelect.Condition.condition_name}` })
        } else {
            res.status(400).send({ message: "ไม่พบเงื่อนไขนี้ในกระเป๋า" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

module.exports = {
    selectCondition,
    activeCondition,
    disableCondition
}