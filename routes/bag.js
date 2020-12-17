const router = require('express').Router();
const passport = require('passport');
const { createGrowBag, getMyMoneyBag, getMyFunBag, getMyGrowBag, getAllBags } = require('../controllers/bagController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/', auth, createGrowBag);
router.get('/', auth, getAllBags);
router.get('/money', auth, getMyMoneyBag);
router.get('/fun', auth, getMyFunBag);
router.get('/grow', auth, getMyGrowBag);

module.exports = router;