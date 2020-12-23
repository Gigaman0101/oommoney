const router = require('express').Router();
const { createCondition, getAllCondition, getAllConditionByUser, getConditionByName } = require('../controllers/conditionController');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false })

router.post("/", auth, createCondition);
router.get("/", getAllCondition);
router.get("/myConditions", auth, getAllConditionByUser);
router.get("/nameConditions", auth, getConditionByName);

module.exports = router;