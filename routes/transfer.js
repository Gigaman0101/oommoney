const router = require('express').Router();
const { transferByUser, transferByDeposit, transferByWithdraw } = require('../controllers/transferController');
const passport = require('passport');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/deposit', auth, transferByDeposit);
router.post('/withdraw', auth, transferByWithdraw);
router.post('/:id', auth, transferByUser);

module.exports = router;