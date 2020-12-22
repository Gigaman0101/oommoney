const db = require('../models');
const { Op } = require('sequelize');

const transferByUser = async (req, res) => {
    try {
        const { amountPlus, firstName } = req.body;
        const targetTransferTo = await db.User.findOne({ where: { firstName } });
        const BagTransferTo = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: targetTransferTo.id },
                    { type_bag: "MONEY BAG" }
                ]
            }
        });
        const BagTransferBy = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "MONEY BAG" }
                ]
            }
        });

        const targetCondition = await db.ConditionBag.findOne({ where: { condition_name: "เก็บทุกครั้งที่ฝาก" } });

        const targetSelect = await db.Has.findOne({
            where: { condition_id: targetCondition.id },
            include: [
                { model: db.ConditionBag }
            ]
        });
        console.log(targetTransferTo);

        const conditionBag = await db.Bag.findOne({ where: { id: targetSelect.bag_id } });

        let amountTransfer = Number(amountPlus) + Number(targetCondition.condition_amount);

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        if (targetTransferTo) {
            if (BagTransferBy) {
                if (BagTransferBy.amount >= amountPlus) {
                    if (targetSelect) {
                        if (Number(BagTransferBy.amount) >= amountTransfer) {
                            await BagTransferTo.update({
                                amount: Number(amountPlus) + Number(BagTransferTo.amount)
                            });

                            await BagTransferBy.update({
                                amount: Number(BagTransferBy.amount) - Number(amountTransfer)
                            });

                            await conditionBag.update({
                                amount: Number(conditionBag.amount) + Number(targetCondition.condition_amount)
                            });

                            const newTransfer = await db.Transfer.create({
                                amount: amountPlus,
                                type_transfer: "โอน",
                                transfer_to: targetTransferTo.id,
                                transfer_by: req.user.id,
                                bag_by: BagTransferBy.id,
                                bag_to: BagTransferTo.id
                            });

                            const newConditionTransfer = await db.Transfer.create({
                                amount: targetCondition.condition_amount,
                                type_transfer: "โอน แบบมีเงื่อนไข",
                                transfer_to: req.user.id,
                                transfer_by: req.user.id,
                                bag_by: BagTransferBy.id,
                                bag_to: conditionBag.id
                            });


                            res.status(201).send({ newTransfer, newConditionTransfer });
                        } else {
                            res.status(400).send({ message: "เงินในกระเป๋าของคุณไม่พอเมื่อโอนแบบใช้เงื่อนไข" })
                        };
                    } else {
                        const newTransfer = await db.Transfer.create({
                            amount: amountPlus,
                            type_transfer: "โอน",
                            transfer_to: targetTransferTo.id,
                            transfer_by: req.user.id,
                            bag_by: BagTransferBy.id,
                            bag_to: BagTransferTo.id
                        });

                        await BagTransferTo.update({
                            amount: +amountPlus + +BagTransferTo.amount
                        });

                        await BagTransferBy.update({
                            amount: +BagTransferBy.amount - +amountPlus
                        });

                        res.status(201).send(newTransfer);
                    };
                } else {
                    res.status(400).send({ message: "คุณมีเงินไม่พอสำหรับการ 'โอน'" });
                };
            } else {
                res.status(400).send({ message: "กรุณาสร้างกระเป๋านี้ก่อน" })
            };
        } else {
            res.status(400).send({ message: "ไม่พบ user นี้" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const transferByDeposit = async (req, res) => {
    try {
        const { amountPlus } = req.body;
        const myBag = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "MONEY BAG" }
                ]
            }
        });

        const targetCondition = await db.ConditionBag.findOne({ where: { condition_name: "เก็บทุกครั้งที่ฝาก" } });

        const targetSelect = await db.Has.findOne({
            where: { condition_id: targetCondition.id },
            include: [
                { model: db.ConditionBag }
            ]
        });

        const conditionBag = await db.Bag.findOne({ where: { id: targetSelect.bag_id } });

        let amountDeposit = Number(amountPlus) - Number(targetCondition.condition_amount);

        if (myBag) {

            //กรณีมีเงื่อนไข การเก็บเงิน
            if (targetSelect) {

                if (amountPlus < targetCondition.condition_amount) {
                    res.status(400).send({ message: "ไม่สามารถใช้เงื่อนไขนี้ได้เนื่องจากคุณกรอกจำนวนเงินที่ฝากน้อยกว่า จำนวนเงินในเงื่อนไข" })
                } else {

                    console.log(conditionBag, 'conditionBag');

                    await myBag.update({
                        amount: +amountDeposit + +myBag.amount
                    });

                    await conditionBag.update({
                        amount: +targetCondition.condition_amount + +conditionBag.amount
                    });

                    console.log("KO");

                    const newDeposit = await db.Transfer.create({
                        amount: amountDeposit,
                        type_transfer: "ฝาก",
                        transfer_to: req.user.id,
                        bag_to: myBag.id
                    });

                    const newConditionDeposit = await db.Transfer.create({
                        amount: targetCondition.condition_amount,
                        type_transfer: `ฝาก แบบมีเงื่อนไข`,
                        transfer_to: req.user.id,
                        transfer_by: req.user.id,
                        bag_by: myBag.id,
                        bag_to: conditionBag.id
                    });

                    res.status(200).send({ newDeposit, newConditionDeposit });
                };

            } else {
                const newDeposit = await db.Transfer.create({
                    amount: amountPlus,
                    type_transfer: "ฝาก",
                    transfer_to: req.user.id,
                    bag_to: myBag.id
                });

                console.log("COMin");
                await myBag.update({
                    amount: +amountPlus + +myBag.amount
                });
                res.status(200).send(newDeposit);
            }

        } else {
            res.status(400).send({ message: "กรุณาสร้างกระเป๋านี้ก่อน" });
        };

        res.status(201).send(newDeposit);

    } catch (err) {
        console.log(err);
        res.status(500).status({ message: err.message });
    };
};

const transferByWithdraw = async (req, res) => {
    try {
        const { amountMinus } = req.body;
        const myBag = await db.Bag.findOne({
            where: {
                [Op.and]: [
                    { user_id: req.user.id },
                    { type_bag: "MONEY BAG" }
                ]
            }
        });

        const targetCondition = await db.ConditionBag.findOne({ where: { condition_name: "เก็บทุกครั้งที่ถอน" } });

        const targetSelect = await db.Has.findOne({
            where: { condition_id: targetCondition.id },
            include: [
                { model: db.ConditionBag }
            ]
        });

        const conditionBag = await db.Bag.findOne({ where: { id: targetSelect.bag_id } });

        let amountWithdraw = Number(amountMinus) + Number(targetCondition.condition_amount);

        if (myBag) {
            if (Number(myBag.amount) >= amountMinus) {
                if (targetSelect) {
                    if (Number(myBag.amount) >= amountWithdraw) {
                        await myBag.update({
                            amount: Number(myBag.amount) - Number(amountWithdraw)
                        });

                        await conditionBag.update({
                            amount: Number(conditionBag.amount) + Number(targetCondition.condition_amount)
                        });

                        const newWithdraw = await db.Transfer.create({
                            amount: amountWithdraw,
                            type_transfer: "ถอน",
                            transfer_by: req.user.id,
                            bag_by: myBag.id
                        });

                        const newConditionWithdraw = await db.Transfer.create({
                            amount: targetCondition.condition_amount,
                            type_transfer: "ถอน แบบมีเงื่อนไข",
                            transfer_by: req.user.id,
                            transfer_to: req.user.id,
                            bag_by: myBag.id,
                            bag_to: conditionBag.id
                        })

                        res.status(201).send({ newWithdraw, newConditionWithdraw });
                    } else {
                        res.status(400).send({ message: "จำนวนเงินในบัญชีของคุณไม่พอ" })
                    }
                } else {
                    const newWithdraw = await db.Transfer.create({
                        amount: amountMinus,
                        type_transfer: "ถอน",
                        transfer_by: req.user.id,
                        bag_by: myBag.id
                    });

                    await myBag.update({
                        amount: +myBag.amount - +amountMinus
                    });

                    res.status(201).send(newWithdraw);
                }
            } else {
                res.status(400).send({ message: "จำนวนเงินในบัญชีของคุณไม่พอ" });
            };

        } else {
            res.status(400).send({ message: "กรุณาสร้างกระเป๋าก่อน" });
        };

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const transferByInside = async (req, res) => {
    try {
        const { amountPlus, type_bagBy, type_bagTo } = req.body;
        const targetTransferTo = await db.User.findOne({ where: { id: req.user.id } }); // หาตัวเองเพราะส่งแค่ภายใน
        const BagTransferTo = await db.Bag.findOne({
            where: {
                user_id: targetTransferTo.id,
                type_bag: type_bagTo
            }
        });
        const BagTransferBy = await db.Bag.findOne({
            where: {
                user_id: req.user.id,
                type_bag: type_bagBy
            }
        });

        console.log(targetTransferTo);

        if (BagTransferBy.amount >= amountPlus) {
            if (targetTransferTo) {
                const newTransfer = await db.Transfer.create({
                    amount: amountPlus,
                    type_transfer: "โอนภายใน",
                    transfer_to: targetTransferTo.id,
                    transfer_by: req.user.id,
                    bag_by: BagTransferBy.id,
                    bag_to: BagTransferTo.id
                });

                await BagTransferTo.update({
                    amount: +amountPlus + +BagTransferTo.amount
                });

                await BagTransferBy.update({
                    amount: +BagTransferBy.amount - +amountPlus
                });

                res.status(201).send(newTransfer);
            } else {
                res.status(400).send({ message: "ไม่พบ user นี้" });
            };
        } else {
            res.status(400).send({ message: "คุณมีเงินไม่พอสำหรับการ 'โอน'" });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

const getAllTransByUser = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });

        if (targetUser) {
            const myTrans = await db.Transfer.findAll({
                where: {
                    [Op.and]: [
                        { user_id: req.user.id },
                        { type_transfer: "โอน" }
                    ]
                }
            });
            res.status(200).send(myTrans);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" });
        };
    } catch (err) {
        res.status(500).send({ message: err.message })
    };
};

const getAllDepositByUser = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const myDeposit = await db.Transfer.findAll({
                where: {
                    [Op.and]: [
                        { user_id: req.user.id },
                        { type_transfer: "ฝาก" }
                    ]
                }
            });

            res.status(200).send(myDeposit);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" });
        };
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const getAllWithdrawByUser = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });

        if (targetUser) {
            const myWithdraw = await db.Transfer.findAll({
                where: {
                    [Op.and]: [
                        { user_id: req.user.id },
                        { type_transfer: "ถอน" }
                    ]
                }
            });
            res.status(200).send(myWithdraw);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" });
        };
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const getAllHistoryByMoney = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { type_bag: "MONEY BAG", user_id: req.user.id } })
            const myAllHistory = await db.Transfer.findAll({
                where: {
                    [Op.or]: [
                        { bag_by: targetBag.id },
                        { bag_to: targetBag.id },
                        // { transfer_by: targetUser.id },
                        // { transfer_to: targetUser.id }
                    ]
                },
            });
            const newAllHistory = myAllHistory.map(item => {
                // console.log(item.dataValues)
                const newItem = { ...item.dataValues }
                newItem.createdAt = new Date(item.dataValues.createdAt).toDateString()
                return newItem
            })

            res.status(200).send(newAllHistory);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getAllHistoryByGrow = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { type_bag: "GROW BAG", user_id: req.user.id } })
            const myAllHistory = await db.Transfer.findAll({
                where: {
                    [Op.or]: [
                        { bag_by: targetBag.id },
                        { bag_to: targetBag.id },
                        // { transfer_by: targetUser.id },
                        // { transfer_to: targetUser.id }
                    ]
                },
            });
            const newAllHistory = myAllHistory.map(item => {
                // console.log(item.dataValues)
                const newItem = { ...item.dataValues }
                newItem.createdAt = new Date(item.dataValues.createdAt).toDateString()
                return newItem
            })

            res.status(200).send(newAllHistory);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

const getAllHistoryByFun = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } });
        if (targetUser) {
            const targetBag = await db.Bag.findOne({ where: { type_bag: "FUN BAG", user_id: req.user.id } })
            const myAllHistory = await db.Transfer.findAll({
                where: {
                    [Op.or]: [
                        { bag_by: targetBag.id },
                        { bag_to: targetBag.id },
                        // { transfer_by: targetUser.id },
                        // { transfer_to: targetUser.id }
                    ]
                },
            });
            const newAllHistory = myAllHistory.map(item => {
                // console.log(item.dataValues)
                const newItem = { ...item.dataValues }
                newItem.createdAt = new Date(item.dataValues.createdAt).toDateString()
                return newItem
            })

            res.status(200).send(newAllHistory);
        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อคอิน" })
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

module.exports = {
    transferByUser,
    transferByDeposit,
    transferByWithdraw,
    transferByInside,
    getAllTransByUser,
    getAllDepositByUser,
    getAllWithdrawByUser,
    getAllHistoryByMoney,
    getAllHistoryByGrow,
    getAllHistoryByFun
}