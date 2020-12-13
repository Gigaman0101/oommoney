const router = require('express').Router();
const passport = require('passport');
const { activeCondition, selectCondition, disableCondition } = require('../controllers/hasController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post("/", auth, selectCondition);
router.patch("/active/:id", activeCondition);
router.patch("/disable/:id", disableCondition);

module.exports = router;