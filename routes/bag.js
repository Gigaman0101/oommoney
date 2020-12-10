const router = require('express').Router();
const passport = require('passport');
const { createBag } = require('../controllers/bag');

const auth = passport.authenticate("jwt-auth", { session: false });

router.post('/', auth, createBag);

module.exports = router;