const router = require('express').Router();
const { transferByUser } = require('../controllers/transfer')

router.post('/transfer', transferByUser)

module.exports = router;