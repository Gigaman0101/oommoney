const router = require('express').Router();
const passport = require('passport');
const { createGrowBag } = require('../controllers/bagController');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/', auth, createGrowBag);

module.exports = router;