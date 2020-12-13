const router = require('express').Router();
const { createCondition, getAllCondition } = require('../controllers/conditionController');

router.post("/", createCondition);
router.get("/", getAllCondition)

module.exports = router;