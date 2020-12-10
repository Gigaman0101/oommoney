const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            email,
            phone_number,
            status, id_card,
            education_level,
            price_range,
            career,
            house_no,
            moo,
            floor,
            village,
            soi,
            road,
            province,
            district,
            sub_district,
            postal_code
        } = req.body;
        const targetUser = await db.User.findOne({ where: { username } });

        if (targetUser) {
            res.status(400).send({ message: "Username already taken." })
        } else {
            const salt = bcryptjs.genSaltSync(Number(process.env.SALT_ROUND));
            const hashedPwd = bcryptjs.hashSync(password, salt);

            const newUser = await db.User.create({
                username,
                password: hashedPwd,
                firstName,
                lastName,
                email,
                phone_number,
                status,
                id_card,
                education_level,
                price_range,
                career
            });

            await db.Bag.create({
                name_bag: `${firstName}'s bag`,
                // amount,
                type_bag: "MONEY BAG",
                user_id: newUser.id
            });

            await db.Address.create({
                user_id: newUser.id,
                house_no,
                moo,
                floor,
                village,
                soi,
                road,
                province,
                district,
                sub_district,
                postal_code
            });

            res.status(201).send({ message: "User has been created" })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const targetUser = await db.User.findOne({ where: { username } });

        if (!targetUser) {
            res.status(400).send({ message: "username or password incorrect" });
        } else {
            const isCorrect = bcryptjs.compareSync(password, targetUser.password);
            if (isCorrect) {
                const payload = {
                    id: targetUser.id
                };
                const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 })
                res.status(200).send({ token })
            } else {
                res.status(400).send({ message: "username or password incorrect" })
            }
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUsers = await db.User.findAll({
            include: {
                model: db.Address
            }
        });
        res.status(200).send(allUsers)
    } catch (err) {
        res.status(500).send({ message: err.message })
    };
}

module.exports = {
    register,
    login,
    getAllUser
}