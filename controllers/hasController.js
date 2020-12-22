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
        const { id } = req.body;
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });

        if (targetUser) {
            const targetBag = await db.Bag.findOne({
                where: {
                    user_id: targetUser.id
                }
            });
            if (targetBag) {
                const targetSelect = await db.Has.findOne({
                    where: { id },
                    include: {
                        model: db.ConditionBag
                    }
                });

                if (targetSelect) {
                    await targetSelect.destroy();

                    res.status(200).send({ message: `ปิด เงื่อนไข ${targetSelect.ConditionBag.condition_name} และ ลบสำเร็จ` });
                } else {
                    res.status(400).send({ message: "ไม่พบการ match นี้" })
                }
            } else {
                res.status(400).send({ message: "ไม่พบกระเป๋านี้" });
            }
        } else {
            res.status(400).send({ message: "ยังไม่ได้ล็อคอิน" });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getAllSelectByUser = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const { type_bag } = req.body;
            const targetBag = await db.Bag.findOne({ where: { user_id: targetUser.id, type_bag } })
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
    getAllSelectByUser
}