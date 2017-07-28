var express = require('express');
var router = express.Router();
const CheController = require('../../controllers/che-controller');
const cheCtrl = new CheController();

router.get('/', cheCtrl.getStudents);
router.get('/url', cheCtrl.getCheUrl);
router.post('/', cheCtrl.createChe);
router.delete('/', cheCtrl.deleteChe);

module.exports = router;
