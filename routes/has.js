const router = require('express').Router();
const passport = require('passport');
const {
    selectCondition,
    disableCondition,
    getAllSelectByUser
} = require('../controllers/hasController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post("/", auth, selectCondition);
router.delete("/disable", auth, disableCondition);
router.get("/", auth, getAllSelectByUser);

module.exports = router;