const router = require('express').Router();
const { transferByUser, transferByDeposit, transferByWithdraw, transferByInside } = require('../controllers/transferController');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/deposit', auth, transferByDeposit);
router.post('/withdraw', auth, transferByWithdraw);
router.post('/', auth, transferByUser);
router.post('/inside', auth, transferByInside);

module.exports = router;