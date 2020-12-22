const db = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const register = async (req, res) => {
    try {
        console.log(req.file);
        const {
            username,
            password,
            firstName,
            lastName,
            email,
            phone_number,
            status,
            id_card,
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
            const file = req.file; // รับค่า file จาก multer
            console.log(file);

            cloudinary.uploader.upload(file.path, async (error, result) => {
                console.log(result);
                console.log('---------------');
                console.log(error);

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
                    career,
                    profile_url: result.secure_url
                });

                await db.Bag.create({
                    name_bag: `${firstName}'s bag`,
                    type_bag: "MONEY BAG",
                    user_id: newUser.id
                });

                // initial create address
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

                fs.unlinkSync(file.path);
                res.status(201).send({ message: "User has been created" })
            })


        }
    } catch (err) {
        console.log(err);
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
                    id: targetUser.id,
                    username: targetUser.username,
                    firstName: targetUser.firstName,
                    lastName: targetUser.lastName,
                    email: targetUser.email,
                    phone_number: targetUser.phone_number,
                    status: targetUser.status,
                    id_card: targetUser.id_card,
                    education_level: targetUser.education_level,
                    price_range: targetUser.price_range,
                    career: targetUser.career,
                    profile_url: targetUser.profile_url,
                    expire: new Date().getTime() + 3600000
                };
                const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 })
                res.status(200).send({ token })
            } else {
                res.status(400).send({ message: "username or password incorrect" })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUsers = await db.User.findAll({
            include: [
                { model: db.Address },
                { model: db.Bag }
            ]
        });
        res.status(200).send(allUsers)
    } catch (err) {
        res.status(500).send({ message: err.message })
    };
};

const updateImageUser = async (req, res) => {
    try {
        const targetUser = await db.User.findOne({ where: { id: req.user.id } })
        const file = req.file;

        if (targetUser) {
            cloudinary.uploader.upload(file.path, async (error, result) => {
                console.log(result);
                console.log('----------------');
                console.log(error);

                await targetUser.update({
                    profile_url: result.secure_url
                });

                // targetUser.profile_url = result.secure_url
                // targetUser.save();

                fs.unlinkSync(file.path);
                res.status(200).send({ message: `update image user: ${targetUser.id} success` })
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    };
};

const getUserById = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};

module.exports = {
    register,
    login,
    getAllUser,
    getUserById,
    updateImageUser
}