const router = require('express').Router();
const passport = require('passport');
const { getMyMoneyBag, getMyFunBag, getMyGrowBag, getAllBags, createGrowFunBag, getAllMoney } = require('../controllers/bagController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/grow_fun', auth, createGrowFunBag)
router.get('/', auth, getAllBags);
router.get('/all_money', auth, getAllMoney);
router.get('/money', auth, getMyMoneyBag);
router.get('/fun', auth, getMyFunBag);
router.get('/grow', auth, getMyGrowBag);

module.exports = router;