const router = require('express').Router();
const { transferByUser, transferByDeposit, transferByWithdraw, transferByInside, getAllHistoryByMoney, getAllHistoryByGrow, getAllHistoryByFun } = require('../controllers/transferController');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/deposit', auth, transferByDeposit);
router.post('/withdraw', auth, transferByWithdraw);
router.post('/', auth, transferByUser);
router.post('/inside', auth, transferByInside);
router.get('/history_money', auth, getAllHistoryByMoney);
router.get('/history_fun', auth, getAllHistoryByFun);
router.get('/history_grow', auth, getAllHistoryByGrow);

module.exports = router;