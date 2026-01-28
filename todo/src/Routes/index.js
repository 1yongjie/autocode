const express = require('express');
const router = express.Router();

const listRouter = require('./List');
const LandR = require('./LogRegis');

router.use('/List', listRouter);
router.use('/LogRegis', LandR);

module.exports = router;