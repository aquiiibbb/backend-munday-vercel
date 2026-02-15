const express = require('express');
const router = express.Router();
const { Usercreate } = require('../Controller/user.Controllers');

router.post('/user', Usercreate);

module.exports = router;