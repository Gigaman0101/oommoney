const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const transferByUser = async (req, res) => {
    try {
        const { amount } = req.body;
        const { transfer_to } = req.params;
        const targetTransferTo = await db.User.findOne({ where: { id: transfer_to } })

        if (targetTransferTo) {
            const newTransfer = await db.Transfer.create({
                amount,
                type_transfer: "โอน",
                transfer_to: targetTransferTo.id,
                transfer_by: req.user.id
            });
            res.status(201).send(newTransfer);
        } else {
            res.status(400).send({ message: "ไม่พบบัญชี นี้" })
        };
    } catch (err) {
        res.status(500).send({ message: err.message })
    };
};

const transferByDeposit = async () => {
    try {
        const { amount } = req.body;
        const newDeposit = await db.Transfer.create({
            amount,
            type_transfer: "ฝาก",
            transfer_to: req.user.id,
        });

        res.status(201).send(newDeposit);

    } catch (err) {
        res.status(500).status({ message: err.message })
    };
};

const transferByWithdraw = async (req, res) => {
    try {
        const { amount } = req.body;
        const newDeposit = await db.Transfer.create({
            amount,
            type_transfer: "ถอน",
            transfer_by: req.user.id,
        });

        res.status(201).send(newDeposit);
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

module.exports = {
    transferByUser,
    transferByDeposit,
    transferByWithdraw
}