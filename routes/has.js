const router = require('express').Router();
const passport = require('passport');
const {
    selectCondition,
    disableCondition,
    getAllSelectByMoney,
    getAllSelectByFun,
    getAllSelectByGrow
} = require('../controllers/hasController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post("/", auth, selectCondition);
router.delete("/:id", auth, disableCondition);
router.get("/money", auth, getAllSelectByMoney);
router.get("/grow", auth, getAllSelectByGrow);
router.get("/fun", auth, getAllSelectByFun);

module.exports = router;