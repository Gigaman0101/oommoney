const router = require('express').Router();
const { createCondition, getAllCondition, getAllConditionByUser } = require('../controllers/conditionController');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false })

router.post("/", auth, createCondition);
router.get("/", getAllCondition);
router.get("/myConditions", auth, getAllConditionByUser);

module.exports = router;