const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const transferByUser = async (req, res) => {
    try {
        const { transfer_to, amount, type_transfer } = req.body;
        const targetTransferTo = await db.User.findOne({ where: { id: transfer_to } })

        if (targetTransferTo) {
            const newTransfer = await db.Transfer.create({
                amount,
                type_transfer,
                transfer_to: targetTransferTo.id,
                transfer_by: req.user.id
            });
            res.status(201).send(newTransfer);
        } else {
            res.status(400).send({ message: "ไม่พบบัญชี นี้" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

module.exports = {
    transferByUser
}