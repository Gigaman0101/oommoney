const db = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('../models');

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

        console.log(targetTransferTo);

        if (BagTransferBy.amount >= amountPlus) {
            if (targetTransferTo) {
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
            } else {
                res.status(400).send({ message: "ไม่พบ user นี้" });
            };
        } else {
            res.status(400).send({ message: "คุณมีเงินไม่พอสำหรับการ 'โอน'" });
        };

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

        if (myBag) {

            const newDeposit = await db.Transfer.create({
                amount: amountPlus,
                type_transfer: "ฝาก",
                transfer_to: req.user.id,
                bag_to: myBag.id
            });

            await myBag.update({
                amount: +amountPlus + +myBag.amount
            });
            res.status(200).send(newDeposit);
        } else {
            res.status(400).send({ message: "ไม่พบบัญชีนี้" });
        }

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

        if (myBag) {
            if (Number(myBag.amount) >= amountMinus) {
                const newDeposit = await db.Transfer.create({
                    amount: amountMinus,
                    type_transfer: "ถอน",
                    transfer_by: req.user.id,
                    bag_by: myBag.id
                });

                await myBag.update({
                    amount: +myBag.amount - +amountMinus
                });

                res.status(201).send(newDeposit);
            } else {
                res.status(400).send({ message: "จำนวนเงินในบัญชีของคุณไม่พอ" });
            };

        } else {
            res.status(400).send({ message: "คุณยังไม่ได้ล็อกอิน" });
        };

    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

const transferByInside = async (req, res) => {
    try {
        const { amountPlus, type_bagBy, type_bagTo, bag_by, bag_to } = req.body;
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