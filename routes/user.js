const router = require("express").Router();
const { register, login, getAllUser } = require('../controllers/user')

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUser);

module.exports = router;