const router = require("express").Router();
const { register, login, getAllUser, updateImageUser } = require('../controllers/userController');
const { upload } = require('../middleware/upload');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false })

router.post("/register", upload.single('image'), register);
router.post("/login", login);
router.get("/", getAllUser);
router.patch('/upload', auth, upload.single('image'), updateImageUser);

module.exports = router;