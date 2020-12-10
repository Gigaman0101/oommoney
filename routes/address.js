const router = require('express').Router();
const { createAddress } = require('../controllers/address');

router.post('/', createAddress);

module.exports = router;