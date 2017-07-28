const express = require('express');
const router = express.Router();
const WeChatLoginController = require('../../controllers/weChat-login-controller');
const weChatLoginController = new WeChatLoginController();

router.post('/', weChatLoginController.weChat);

module.exports = router;
