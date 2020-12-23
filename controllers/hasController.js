const db = require('../models');

const selectCondition = async (req, res) => {
    try {
        const { condition_id, bag_id } = req.body;

        const targetUser = await db.User.findOne({ where: { id: req.user.id } })
        if (targetUser) {
            const targetCondition = await db.ConditionBag.findOne({
                where: {
                    id: condition_id,
                }
            });

            if (targetCondition) {
                const targetBag = await db.Bag.findOne({ where: { id: bag_id } })
                const newSelect = await db.Has.create({
                    bag_id: targetBag.id,
                    condition_id: targetCondition.id,
                    // status: "DISABLE"
                });

                res.status(201).send(newSelect);
            } else {
                res.status(400).send({ message: "ไม่พบ condition นี้" });
            };
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};

// const activeCondition = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const targetSelect = await db.Has.findOne({
//             where: { id },
//             include: {
//                 model: db.Condition
//             }
//         });
//         if (targetSelect) {
//             await targetSelect.update({
//                 status: "ACTIVE"
//             });

//             res.status(200).send({ message: `เปิดใช้งานเงื่อนไข ${targetSelect.Condition.condition_name}` })
//         } else {
//             res.status(400).send({ message: "ไม่พบเงื่อนไขนี้ในกระเป๋า" })
//         };
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ message: err.message });
//     };
// };

const disableCondition = async (req, res) => {
    try {
        const { id } = req.params;
        const targetSelect = await db.Has.findOne({
            where: { id: id },
            include: {
                model: db.ConditionBag
            }
        });
        console.log('targetSelect: ', targetSelect);
        await targetSelect.destroy();

        res.status(200).send({ message: `ลบสำเร็จ` });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getAllSelectByMoney = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { user_id: targetUser.id, type_bag: "MONEY BAG" } })
            if (targetBag) {
                const targetSelect = await db.Has.findAll({ where: { bag_id: targetBag.id }, include: { model: db.ConditionBag } });

                res.status(200).send(targetSelect);
            } else {
                res.status(400).send({ message: "คุณยังไม่ได้สร้างกระเป๋านี้" });
            }
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

const getAllSelectByGrow = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { user_id: targetUser.id, type_bag: "GROW BAG" } })
            if (targetBag) {
                const targetSelect = await db.Has.findAll({ where: { bag_id: targetBag.id }, include: { model: db.ConditionBag } });

                res.status(200).send(targetSelect);
            } else {
                console.log("Fail")
                res.status(400).send({ message: "คุณยังไม่ได้สร้างกระเป๋านี้" });
            }
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

const getAllSelectByFun = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { user_id: targetUser.id, type_bag: "FUN BAG" } })
            if (targetBag) {
                const targetSelect = await db.Has.findAll({ where: { bag_id: targetBag.id }, include: { model: db.ConditionBag } });

                res.status(200).send(targetSelect);
            } else {
                res.status(400).send({ message: "คุณยังไม่ได้สร้างกระเป๋านี้" });
            }
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

module.exports = {
    selectCondition,
    disableCondition,
    getAllSelectByMoney,
    getAllSelectByGrow,
    getAllSelectByFun
}