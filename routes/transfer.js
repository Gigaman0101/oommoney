const router = require('express').Router();
const { transferByUser, transferByDeposit, transferByWithdraw } = require('../controllers/transferController')

router.post('/transfer/:id', transferByUser)
router.post('/transfer_Deposit', transferByDeposit)
router.post('/transfer_Withdraw', transferByWithdraw)

module.exports = router;