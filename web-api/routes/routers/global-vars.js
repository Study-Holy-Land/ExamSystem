var {Router} = require('express');
var router = Router();
const GlobalVarsController = require('../../controllers/global-vars-controller');

const globalVarsCtrl = new GlobalVarsController();

router.get('/', globalVarsCtrl.getAll);

module.exports = router;
