var express = require('express');
var router = express.Router();

const ProfileController = require('../../controllers/profile-controller');
const profCtrl = new ProfileController();

router.get('/', profCtrl.getUserDetail);

module.exports = router;
