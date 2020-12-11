const router = require('express').Router();
const { createAddress } = require('../controllers/addressController');

router.post('/', createAddress);

module.exports = router;